package com.example.video_steam.model;

import lombok.Data;

@Data
public class JoinRoomRequest {
    private String roomId;
    private String roomPassword;
}
