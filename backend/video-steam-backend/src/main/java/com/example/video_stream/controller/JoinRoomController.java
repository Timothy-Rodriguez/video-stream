package com.example.video_stream.controller;

import com.example.video_stream.mapping.Room;
import com.example.video_stream.mapping.RoomRepository;
import com.example.video_stream.model.JoinRoomRequest;
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
import java.util.Optional;

@RestController
public class JoinRoomController {
    private final RoomService roomService;
    private final RoomRepository roomRepository;
    private final AuthenticationManager manager;

    public JoinRoomController(RoomService roomService, RoomRepository roomRepository, AuthenticationManager manager) {
        this.roomService = roomService;
        this.roomRepository = roomRepository;
        this.manager = manager;
    }

    @PostMapping("/join-room")
    public ResponseEntity<?> joinRoom(@RequestBody JoinRoomRequest joinRoomRequest, HttpServletResponse response) {
        String roomId = joinRoomRequest.getRoomId();
        String rawPassword = joinRoomRequest.getRoomPassword();

        Optional<Room> roomOptional = roomRepository.findByRoomId(roomId);
        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            boolean matches = roomService.verifyRoomPassword(rawPassword, room.getRoomPassword());
            if (matches) {
                // Generate JWT Token
                String jwtToken = roomService.generateJwtFromIdPassword(roomId, rawPassword);

                // Set the jwt token in http-only cookie
                Cookie cookie = new Cookie("jwt", jwtToken);
                cookie.setHttpOnly(true);
                cookie.setPath("/"); // cookie accessible across the app
                response.addCookie(cookie);

                // Get the uuid of the room
                Map<String, String> responseMap = new HashMap<>();
                responseMap.put("status", "success");
                responseMap.put("room", roomOptional.get().getId());

                return ResponseEntity.ok(responseMap);

            } else {
                Map<String, String> responseMap = new HashMap<>();
                responseMap.put("status", "failed");
                responseMap.put("reason", "Invalid password");
                return ResponseEntity.status(HttpStatus.OK).body(responseMap);
            }
        } else {
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "failed");
            responseMap.put("reason", "Room not found");
            return ResponseEntity.status(HttpStatus.OK).body(responseMap);
        }
    }
}
