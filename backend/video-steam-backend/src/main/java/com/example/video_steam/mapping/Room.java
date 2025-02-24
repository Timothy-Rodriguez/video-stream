package com.example.video_steam.mapping;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(nullable = false, unique = true)
    private String roomId;

    @Column(nullable = false)
    private String roomPassword;

    @Column
    private String movieFileName;

    @Column
    private String subtitleFileName;

    @Column(length = 500)
    private String movieFileUrl;

    @Column
    private String subtitleFileUrl;

}