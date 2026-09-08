package com.rural.edu.service;

import com.rural.edu.dto.JwtResponse;
import com.rural.edu.dto.LoginRequest;
import com.rural.edu.dto.RegisterRequest;
import com.rural.edu.entity.*;
import com.rural.edu.repository.*;
import com.rural.edu.security.JwtUtils;
import com.rural.edu.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getFullName(), role);
    }

    @Transactional
    public User registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already registered!");
        }

        // Public registration strictly creates STUDENT role only.
        Role assignedRole = Role.ROLE_STUDENT;

        User user = new User(
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFullName(),
                signUpRequest.getPhone(),
                assignedRole
        );

        user = userRepository.save(user);

        Student student = new Student(
                user,
                signUpRequest.getGradeLevel() != null ? signUpRequest.getGradeLevel() : "Standard",
                signUpRequest.getSchoolName() != null ? signUpRequest.getSchoolName() : "Rural Secondary School",
                signUpRequest.getVillageDistrict() != null ? signUpRequest.getVillageDistrict() : "District"
        );
        studentRepository.save(student);

        return user;
    }

    @Transactional
    public User createTeacher(String email, String rawPassword, String fullName, String phone, String qualification, String specialization, String bio) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Error: Email is already registered!");
        }

        User user = new User(email, encoder.encode(rawPassword), fullName, phone, Role.ROLE_TEACHER);
        user = userRepository.save(user);

        Teacher teacher = new Teacher(user, qualification, specialization, bio);
        teacherRepository.save(teacher);

        return user;
    }
}
