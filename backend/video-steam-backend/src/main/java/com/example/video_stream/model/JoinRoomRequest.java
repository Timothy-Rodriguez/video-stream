package com.example.video_stream.model;

import lombok.Data;

@Data
public class JoinRoomRequest {
    private String roomId;
    private String roomPassword;
}
