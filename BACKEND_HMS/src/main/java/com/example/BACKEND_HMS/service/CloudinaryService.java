package com.example.BACKEND_HMS.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "hms_images")
        );
        return (String) uploadResult.get("secure_url");
    }

    public void deleteImage(String imageUrl) throws IOException {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    private String extractPublicId(String imageUrl) {
        // URL format: https://res.cloudinary.com/demo/image/upload/v123/hms_images/filename.jpg
        String[] parts = imageUrl.split("/");
        String fileWithExt = parts[parts.length - 1];
        String folder     = parts[parts.length - 2];
        String filename   = fileWithExt.contains(".")
                ? fileWithExt.substring(0, fileWithExt.lastIndexOf('.'))
                : fileWithExt;
        return folder + "/" + filename;
    }
}