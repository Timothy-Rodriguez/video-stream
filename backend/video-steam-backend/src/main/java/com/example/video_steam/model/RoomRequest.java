package com.example.video_steam.model;

import lombok.Data;

@Data
public class RoomRequest {
    private String roomId;
    private String roomPassword;
    private String movieFileName;
    private String subtitleFileName;
}
