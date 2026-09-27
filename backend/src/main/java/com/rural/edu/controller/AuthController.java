package com.rural.edu.controller;

import com.rural.edu.dto.JwtResponse;
import com.rural.edu.dto.LoginRequest;
import com.rural.edu.dto.RegisterRequest;
import com.rural.edu.entity.User;
import com.rural.edu.repository.UserRepository;
import com.rural.edu.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password!"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already registered!"));
        }

        User user = authService.registerUser(registerRequest);
        return ResponseEntity.ok(Map.of("message", "User registered successfully!", "email", user.getEmail()));
    }
}
