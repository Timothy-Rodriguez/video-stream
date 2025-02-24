package com.example.video_steam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.video_steam.service.RoomService;

@RestController
public class RoomController {

    @Autowired
    RoomService roomService;

    @GetMapping("/room")
    private ResponseEntity<String> room(@RequestParam String roomId) {
        String movieURL = roomService.getVideoURL(roomId);
        return ResponseEntity.ok(movieURL);
    }
}


