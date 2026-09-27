package com.rural.edu.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final Cloudinary cloudinary;

    public FileStorageService(
            @Value("${app.upload.dir:./uploads}") String uploadDir,
            @Value("${app.cloudinary.cloud-name:}") String cloudName,
            @Value("${app.cloudinary.api-key:}") String apiKey,
            @Value("${app.cloudinary.api-secret:}") String apiSecret) {
        
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory.", ex);
        }

        if (cloudName != null && !cloudName.trim().isEmpty() &&
            apiKey != null && !apiKey.trim().isEmpty() &&
            apiSecret != null && !apiSecret.trim().isEmpty()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName.trim(),
                    "api_key", apiKey.trim(),
                    "api_secret", apiSecret.trim(),
                    "secure", true
            ));
        } else {
            this.cloudinary = null;
        }
    }

    private static final java.util.List<String> ALLOWED_CONTENT_TYPES = java.util.Arrays.asList(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/quicktime"
    );

    private static final java.util.List<String> ALLOWED_EXTENSIONS = java.util.Arrays.asList(
            ".pdf", ".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm", ".ogg", ".mov"
    );

    public String storeFile(MultipartFile file, String subFolder) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence: " + originalFileName);
            }

            String contentType = file.getContentType();
            if (contentType != null && !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
                throw new RuntimeException("File type not permitted! Allowed types: PDF, Images (JPEG, PNG, WebP), Videos (MP4, WebM)");
            }

            String fileExtension = "";
            int idx = originalFileName.lastIndexOf('.');
            if (idx > 0) {
                fileExtension = originalFileName.substring(idx).toLowerCase();
            }

            if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
                throw new RuntimeException("File extension " + fileExtension + " is not allowed!");
            }

            // Cloudinary Cloud Upload
            if (cloudinary != null) {
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                        "folder", "rural_edu_platform/" + subFolder,
                        "resource_type", "auto"
                ));
                return (String) uploadResult.get("secure_url");
            }

            // Local Filesystem Storage (Dev Fallback)
            String newFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(subFolder);
            Files.createDirectories(targetLocation);

            Path targetFile = targetLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + subFolder + "/" + newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
}
