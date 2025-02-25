package com.example.video_stream.service;

import com.example.video_stream.mapping.Room;
import com.example.video_stream.mapping.RoomRepository;
import com.example.video_stream.model.RoomRequest;
import com.example.video_stream.security.jwt.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager manager;

    public RoomService(RoomRepository roomRepository, PasswordEncoder passwordEncoder, AuthenticationManager manager) {
        this.roomRepository = roomRepository;
        this.passwordEncoder = passwordEncoder;
        this.manager = manager;
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public Room createRoom(RoomRequest roomRequest) {
        // Check if roomId already exists
        if (roomExists(roomRequest.getRoomId())) {
            throw new IllegalArgumentException("Room ID already exists!");
        }

        // Hash the room password
        String hashedPassword = hashPassword(roomRequest.getRoomPassword());

        Room room = new Room();
        room.setRoomId(roomRequest.getRoomId());
        room.setRoomPassword(hashedPassword);
        room.setMovieFileUrl(roomRequest.getMovieFileUrl());
        room.setSubtitleFileUrl(roomRequest.getSubtitleFileUrl());
        room.setMovieFileName(roomRequest.getMovieFileName());
        room.setSubtitleFileName(roomRequest.getSubtitleFileName());
        return roomRepository.save(room);
    }

    public boolean roomExists(String roomId) {
        Optional<Room> existingRoom = roomRepository.findByRoomId(roomId);
        if (existingRoom.isPresent()) {
            return true;
        }
        return false;
    }

    public String getVideoURL(String UUID) {
        return roomRepository.findById(UUID).get().getMovieFileUrl();
    }

    public boolean verifyRoomPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public String generateJwtFromIdPassword(String roomId, String rawPassword) {
        // If password is correct, generate JWT. Note: The token in not JWT
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                roomId,
                rawPassword
        );

        // this will fail if credentials not valid
        Authentication authentication = manager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwtToken = JwtUtil.generateToken((User) authentication.getPrincipal());
        return jwtToken;
    }
}
