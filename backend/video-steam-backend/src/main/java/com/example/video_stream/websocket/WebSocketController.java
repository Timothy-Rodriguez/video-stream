package com.example.video_stream.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    static class VideoAction {
        public String action = "pause"; // "play" or "pause"
        public double timestamp = 0.000000; // Video timestamp
    }

    @MessageMapping("/send") // Endpoint for client messages
    @SendTo("/topic/messages") // Broadcast messages to subscribers
    public VideoAction broadcastMessage(VideoAction action) {
//        HtmlUtils.htmlEscape()

        System.out.println(action.action);
        System.out.println(action.timestamp);
        return action; // Echo message back to all clients
    }
}

