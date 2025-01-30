package com.example.video_steam.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // This is to get the jwt from header
//        String authHeader = request.getHeader("Authorization");
//        String token = null;
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            token = authHeader.substring(7);
//        }

        String token = null;

        Cookie[] cookies = request.getCookies();

        // Method to extract JWT from cookie
        token = extractJwtFromCookie(cookies);

        if (token != null && JwtUtil.isTokenValid(token)) {
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    JwtUtil.getClaims(token).getSubject(),
                    null, // verified credentials when calling isTokenValid()
                    Collections.emptyList()
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromCookie(Cookie[] cookies) {
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> "jwt".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        } else {
            return null;
        }
    }
}
