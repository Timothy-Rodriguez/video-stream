package com.example.video_steam.service;

import com.example.video_steam.mapping.Room;
import com.example.video_steam.mapping.RoomRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final RoomRepository roomRepository;

    public CustomUserDetailsService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Room room = roomRepository.findByRoomId(username).get();
        return User
                .withUsername(room.getRoomId())
                .password(room.getRoomPassword())
                .build();
    }
}
