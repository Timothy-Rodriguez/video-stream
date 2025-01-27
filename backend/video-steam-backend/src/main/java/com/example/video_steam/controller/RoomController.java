package com.example.video_steam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoomController {

    @GetMapping("/room")
    private ResponseEntity<String> room(@RequestParam String roomId) {
        return ResponseEntity.ok(roomId);
    }
}
