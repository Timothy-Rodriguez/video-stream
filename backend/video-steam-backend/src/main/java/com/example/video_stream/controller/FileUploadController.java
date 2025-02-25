package com.example.video_stream.controller;

import com.example.video_stream.mapping.Room;
import com.example.video_stream.mapping.RoomRepository;
import com.example.video_stream.model.RoomRequest;
import com.example.video_stream.service.RoomService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Nullable;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@RestController
public class FileUploadController {
    private final RoomService roomService;
    private final RoomRepository roomRepository;
    private final AuthenticationManager manager;
    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;


    public FileUploadController(RoomService roomService, RoomRepository roomRepository, AuthenticationManager manager, MinioClient minioClient) {
        this.roomService = roomService;
        this.roomRepository = roomRepository;
        this.manager = manager;
        this.minioClient = minioClient;
    }

    @GetMapping("/check-room")
    public ResponseEntity<?> checkRoomExists(@RequestParam String roomId) {
        if (roomService.roomExists(roomId)) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("reason", "Room ID \"" + roomId + "\" already exists! Please enter unique Room ID ");
            return new ResponseEntity<>(errorResponse, HttpStatus.OK);
        }

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("status", "success");
        errorResponse.put("reason", "Room ID \"" + roomId + "\" available!");
        return new ResponseEntity<>(errorResponse, HttpStatus.OK);
    }

    @PostMapping("/file-upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("movieFile") MultipartFile movieFile,
            @Nullable @RequestParam("subtitleFile") MultipartFile subtitleFile,

            @RequestParam("roomId") String roomId,
            @RequestParam("roomPassword") String roomPassword,
            @RequestParam("movieFileName") String movieFileName,
            @Nullable @RequestParam("subtitleFileName") String subtitleFileName,

            HttpServletResponse response
    ) {

        // Check if roomId exists
        if (roomService.roomExists(roomId)) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("reason", "Room ID already exists. Please enter a unique Room ID");
            System.out.println(roomId + " already exists");
            return new ResponseEntity<>(errorResponse, HttpStatus.OK);
        }
        //System.out.println(roomId.getName());
        // Check if movie or subtitle file exists
        boolean movieExists = false;
        boolean subtitileExists = false;

        // Generate a unique file name
        String movieFilePath = null;
        String subtitleFilePAth = null;

        // Generate a presigned URL for the uploaded file
        String presignedMovieUrl = null;
        String presignedSubtitleUrl = null;

        try {
            System.out.println(movieFile);
            if (movieFile != null) {
                movieExists = true;
                movieFilePath = roomId + "/" + movieFile.getOriginalFilename();
                System.out.println(movieFilePath);
            }

            if (subtitleFile != null) {
                subtitileExists = true;
                subtitleFilePAth = roomId + "/" + subtitleFile.getOriginalFilename();
            }

            // Upload the file to MinIO
            if (movieExists && movieFilePath != null) {
                try (InputStream inputStream = movieFile.getInputStream()) {
                    minioClient.putObject(
                            PutObjectArgs.builder()
                                    .bucket(bucketName)
                                    .object(movieFilePath)
                                    .stream(inputStream, movieFile.getSize(), -1)
                                    .contentType(movieFile.getContentType())
                                    .build()
                    );
                }
            }

            if (subtitileExists && subtitleFile != null) {
                try (InputStream inputStream = subtitleFile.getInputStream()) {
                    minioClient.putObject(
                            PutObjectArgs.builder()
                                    .bucket(bucketName)
                                    .object(subtitleFilePAth)
                                    .stream(inputStream, subtitleFile.getSize(), -1)
                                    .contentType(subtitleFile.getContentType())
                                    .build()
                    );
                }
            }

            if (movieExists) {
                presignedMovieUrl = minioClient.getPresignedObjectUrl(
                        GetPresignedObjectUrlArgs.builder()
                                .method(Method.GET)
                                .bucket(bucketName)
                                .object(movieFilePath)
                                .expiry(7 * 24 * 60 * 60)
                                .build()
                );
            }

            if (subtitileExists) {
                 presignedSubtitleUrl = minioClient.getPresignedObjectUrl(
                        GetPresignedObjectUrlArgs.builder()
                                .method(Method.GET)
                                .bucket(bucketName)
                                .object(subtitleFilePAth)
                                .expiry(7 * 24 * 60 * 60)
                                .build()
                );
            }

            RoomRequest newRoom = new RoomRequest();
            newRoom.setRoomId(roomId);
            newRoom.setRoomPassword(roomPassword);
            newRoom.setMovieFileName(movieFileName);
            newRoom.setSubtitleFileName(subtitleFileName);
            newRoom.setMovieFileUrl(presignedMovieUrl);
            newRoom.setSubtitleFileUrl(presignedSubtitleUrl);
            Room createdRoom = roomService.createRoom(newRoom);

            // Generate JWT Token
            String jwtToken = roomService.generateJwtFromIdPassword(newRoom.getRoomId(), newRoom.getRoomPassword());

            // Set the jwt token in http-only cookie
            Cookie cookie = new Cookie("jwt", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/"); // cookie accessible across the app
            response.addCookie(cookie);

            // Generate responseJson with values needed
            Map<String, String> responseJson = new HashMap<>();
            responseJson.put("status", "success");
            responseJson.put("room", createdRoom.getId());
            responseJson.put("roomId", newRoom.getRoomId());
            responseJson.put("movieFileUrl", newRoom.getMovieFileUrl());
            responseJson.put("subtitleFileUrl", newRoom.getSubtitleFileUrl());

            return new ResponseEntity<>(responseJson, HttpStatus.CREATED);


        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("reason", "Something went wrong! Please try again.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
