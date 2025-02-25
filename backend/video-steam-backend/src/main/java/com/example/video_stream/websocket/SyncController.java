package com.example.video_stream.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SyncController {

    static class VideoAction {
        public String action; // "play", "pause", "seek"
        public int timestamp; // Current timestamp of the video in seconds
    }

    @MessageMapping("/video/action") // Receives messages at /app/video/action
    @SendTo("/topic/sync") // Broadcasts to /topic/sync
    public VideoAction syncVideoAction(VideoAction action) {
        // Simply echo the action to all connected clients
        System.out.println(action);
        return action;
    }
}
