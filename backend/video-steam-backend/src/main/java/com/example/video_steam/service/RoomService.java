package com.example.video_steam.service;

import com.example.video_steam.mapping.Room;
import com.example.video_steam.mapping.RoomRepository;
import com.example.video_steam.model.RoomRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    public RoomService(RoomRepository roomRepository, PasswordEncoder passwordEncoder) {
        this.roomRepository = roomRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public Room createRoom(RoomRequest roomRequest) {
        // Check if roomId already exists
        Optional<Room> existingRoom = roomRepository.findByRoomId(roomRequest.getRoomId());
        if (existingRoom.isPresent()) {
            throw new IllegalArgumentException("Room ID already exists!");
        }

        // Hash the room password
        String hashedPassword = hashPassword(roomRequest.getRoomPassword());

        Room room = new Room();
        room.setRoomId(roomRequest.getRoomId());
        room.setRoomPassword(hashedPassword);
        room.setMovieFileName(roomRequest.getMovieFileName());
        room.setSubtitleFileName(roomRequest.getSubtitleFileName());
        return roomRepository.save(room);
    }

    public boolean verifyRoomPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
