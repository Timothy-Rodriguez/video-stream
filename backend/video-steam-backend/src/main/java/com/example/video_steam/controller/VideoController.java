package com.example.video_steam.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

@RestController
public class VideoController {

    @GetMapping("/video/stream")
    public ResponseEntity<byte[]> streamVideo(@RequestHeader HttpHeaders headers) throws IOException {
        ClassPathResource videoResource = new ClassPathResource("videos/video.mp4");

        if (!videoResource.exists()) {
            return ResponseEntity.notFound().build();
        }

        long videoLength = videoResource.contentLength();
        Optional<HttpRange> rangeOpt = headers.getRange().stream().findFirst();

        if (rangeOpt.isPresent()) {
            HttpRange range = rangeOpt.get();
            long start = range.getRangeStart(videoLength);
            long end = range.getRangeEnd(videoLength);

            byte[] videoData = readRange(videoResource, start, end);
            return ResponseEntity.status(206)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + videoLength)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(videoData);
        }

        // Serve full file if no range requested
        byte[] videoData = videoResource.getInputStream().readAllBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(videoData);
    }

    private byte[] readRange(ClassPathResource resource, long start, long end) throws IOException {
        try (InputStream inputStream = resource.getInputStream()) {
            inputStream.skip(start);
            byte[] buffer = new byte[(int) (end - start + 1)];
            inputStream.read(buffer, 0, buffer.length);
            return buffer;
        }
    }
}
