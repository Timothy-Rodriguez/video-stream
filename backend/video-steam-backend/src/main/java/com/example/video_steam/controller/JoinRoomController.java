package com.example.video_steam.controller;

import com.example.video_steam.security.jwt.JwtUtil;
import com.example.video_steam.mapping.Room;
import com.example.video_steam.mapping.RoomRepository;
import com.example.video_steam.model.JoinRoomRequest;
import com.example.video_steam.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<?> joinRoom(@RequestBody JoinRoomRequest joinRoomRequest) {
        String roomId = joinRoomRequest.getRoomId();
        String rawPassword = joinRoomRequest.getRoomPassword();

        Optional<Room> roomOptional = roomRepository.findByRoomId(roomId);
        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            boolean matches = roomService.verifyRoomPassword(rawPassword, room.getRoomPassword());
            if (matches) {
                //return ResponseEntity.ok("Password is correct");

                // If password is correct, generate JWT. Note: The token in not JWT
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        roomId,
                        rawPassword
                );

                // this will fail if credentials not valid
                Authentication authentication = manager.authenticate(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwtToken = JwtUtil.generateToken((User) authentication.getPrincipal());
                return ResponseEntity.ok(jwtToken);

            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
        }
    }
}
