package com.rural.edu.controller;

import com.rural.edu.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(originPatterns = "*")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Uploaded file cannot be empty!"));
        }

        String fileUrl = fileStorageService.storeFile(file, folder);
        return ResponseEntity.ok(Map.of(
                "fileUrl", fileUrl,
                "fileName", file.getOriginalFilename(),
                "size", file.getSize()
        ));
    }
}
