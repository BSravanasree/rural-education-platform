package com.rural.edu;

import com.rural.edu.dto.RegisterRequest;
import com.rural.edu.entity.Role;
import com.rural.edu.entity.User;
import com.rural.edu.repository.StudentRepository;
import com.rural.edu.repository.UserRepository;
import com.rural.edu.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterUser_ForcesStudentRole() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newstudent@ruraledu.org");
        request.setPassword("password123");
        request.setFullName("Test Student");
        request.setRole(Role.ROLE_ADMIN); // Client tries to send ADMIN role

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User registeredUser = authService.registerUser(request);

        assertNotNull(registeredUser);
        assertEquals("newstudent@ruraledu.org", registeredUser.getEmail());
        assertEquals(Role.ROLE_STUDENT, registeredUser.getRole(), "Public registration must force ROLE_STUDENT regardless of request payload!");
        verify(studentRepository, times(1)).save(any());
    }
}
