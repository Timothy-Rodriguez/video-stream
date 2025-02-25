package com.example.video_stream.controller;

import com.example.video_stream.mapping.Room;
import com.example.video_stream.mapping.RoomRepository;
import com.example.video_stream.model.RoomRequest;
import com.example.video_stream.service.RoomService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
//@RequestMapping("/api/create-room")
public class CreateRoomController {
    private final RoomService roomService;
    private final RoomRepository roomRepository;

    public CreateRoomController(RoomService roomService, RoomRepository roomRepository, AuthenticationManager manager) {
        this.roomService = roomService;
        this.roomRepository = roomRepository;
    }

    @PostMapping("/create-room")
    public ResponseEntity<?> createRoom(@RequestBody RoomRequest roomRequest, HttpServletResponse response) {
        try {
            // Create room
            Room createRoom = roomService.createRoom(roomRequest);

            // Generate responseJson with values needed
            Map<String, String> responseJson = new HashMap<>();
            responseJson.put("status", "success");
            responseJson.put("room", createRoom.getId());
            responseJson.put("roomId", createRoom.getRoomId());
            responseJson.put("movieFileUrl", createRoom.getMovieFileUrl());
            responseJson.put("subtitleFileUrl", createRoom.getSubtitleFileUrl());

            // Generate JWT Token
            String jwtToken = roomService.generateJwtFromIdPassword(roomRequest.getRoomId(), roomRequest.getRoomPassword());

            // Set the jwt token in http-only cookie
            Cookie cookie = new Cookie("jwt", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/"); // cookie accessible across the app
            response.addCookie(cookie);

            return new ResponseEntity<>(responseJson, HttpStatus.CREATED);
        } catch (IllegalArgumentException err) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("reason", "Room ID already exists. Please enter a unique Room ID");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("reason", "Something went wrong! Please try again.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
