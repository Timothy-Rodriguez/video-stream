package com.example.video_steam.controller;

import com.example.video_steam.mapping.Room;
import com.example.video_steam.mapping.RoomRepository;
import com.example.video_steam.model.RoomRequest;
import com.example.video_steam.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    public CreateRoomController(RoomService roomService, RoomRepository roomRepository) {
        this.roomService = roomService;
        this.roomRepository = roomRepository;
    }

    @PostMapping("/api/create-room")
    public ResponseEntity<?> createRoom(@RequestBody RoomRequest roomRequest) {
        try {
            Room createRoom = roomService.createRoom(roomRequest);
            return new ResponseEntity<>(createRoom, HttpStatus.CREATED);
        } catch (IllegalArgumentException err) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Room ID already exists. Please enter a unique Room ID");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Something went wrong! Please try again.");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

//    @PostMapping("/join-room")
//    public ResponseEntity<?> joinRoom(@RequestBody JoinRoomRequest joinRoomRequest) {
//        String roomId = joinRoomRequest.getRoomId();
//        String rawPassword = joinRoomRequest.getRoomPassword();
//
//        Optional<Room> roomOptional = roomRepository.findByRoomId(roomId);
//        if (roomOptional.isPresent()) {
//            Room room = roomOptional.get();
//            boolean matches = roomService.verifyRoomPassword(rawPassword, room.getRoomPassword());
//            if (matches) {
//                return ResponseEntity.ok("Password is correct");
//            } else {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
//            }
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found");
//        }
//    }
}
