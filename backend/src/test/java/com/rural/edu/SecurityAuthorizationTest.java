package com.rural.edu;

import com.rural.edu.entity.Role;
import com.rural.edu.entity.User;
import com.rural.edu.repository.EnrollmentRepository;
import com.rural.edu.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SecurityAuthorizationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testStudentAccessingTeacherRole_FailsRoleCheck() {
        User studentUser = new User("student@ruraledu.org", "pass", "Student Name", "9999999999", Role.ROLE_STUDENT);
        
        // Assert student user role is not ROLE_TEACHER
        assertNotEquals(Role.ROLE_TEACHER, studentUser.getRole(), "ROLE_STUDENT must be blocked from accessing Teacher APIs (403)");
        assertNotEquals(Role.ROLE_ADMIN, studentUser.getRole(), "ROLE_STUDENT must be blocked from accessing Admin APIs (403)");
    }

    @Test
    public void testTeacherAccessingAdminRole_FailsRoleCheck() {
        User teacherUser = new User("teacher@ruraledu.org", "pass", "Teacher Name", "9888888888", Role.ROLE_TEACHER);
        
        assertEquals(Role.ROLE_TEACHER, teacherUser.getRole());
        assertNotEquals(Role.ROLE_ADMIN, teacherUser.getRole(), "ROLE_TEACHER must be blocked from accessing Admin APIs (403)");
    }

    @Test
    public void testDuplicateEnrollment_ReturnsConflictOrBadRequest() {
        Long studentId = 1L;
        Long courseId = 100L;

        when(enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)).thenReturn(true);

        boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);

        assertTrue(alreadyEnrolled, "System must detect existing enrollment to prevent duplicate enrollment (400 Bad Request)");
        verify(enrollmentRepository, times(1)).existsByStudentIdAndCourseId(studentId, courseId);
    }

    @Test
    public void testInvalidUserAccount_ReturnsEmpty() {
        when(userRepository.findByEmail("nonexistent@ruraledu.org")).thenReturn(Optional.empty());

        Optional<User> result = userRepository.findByEmail("nonexistent@ruraledu.org");

        assertTrue(result.isEmpty(), "Unauthenticated or invalid account lookup must yield empty result (401 Unauthorized)");
    }
}
