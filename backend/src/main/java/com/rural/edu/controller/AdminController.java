package com.rural.edu.controller;

import com.rural.edu.entity.*;
import com.rural.edu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(originPatterns = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private com.rural.edu.service.AuthService authService;

    @PostMapping("/teachers")
    public ResponseEntity<?> createTeacher(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String password = payload.get("password");
            String fullName = payload.get("fullName");
            String phone = payload.get("phone");
            String qualification = payload.get("qualification");
            String specialization = payload.get("specialization");
            String bio = payload.get("bio");

            User teacher = authService.createTeacher(email, password, fullName, phone, qualification, specialization, bio);
            return ResponseEntity.status(201).body(Map.of("message", "Teacher account created successfully!", "email", teacher.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAdminAnalytics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActiveTrue();
        long totalStudents = userRepository.countByRole(Role.ROLE_STUDENT);
        long totalTeachers = userRepository.countByRole(Role.ROLE_TEACHER);
        long totalCourses = courseRepository.count();
        long publishedCourses = courseRepository.countByPublishedTrue();
        long totalEnrollments = enrollmentRepository.count();
        long totalQuizAttempts = quizAttemptRepository.count();
        long totalSubmissions = submissionRepository.count();
        long contactMessages = contactMessageRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("totalStudents", totalStudents);
        stats.put("totalTeachers", totalTeachers);
        stats.put("totalCourses", totalCourses);
        stats.put("publishedCourses", publishedCourses);
        stats.put("totalEnrollments", totalEnrollments);
        stats.put("totalQuizAttempts", totalQuizAttempts);
        stats.put("totalSubmissions", totalSubmissions);
        stats.put("contactMessagesCount", contactMessages);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        Boolean active = payload.get("active");
        if (active != null) {
            user.setActive(active);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of("message", "User status updated successfully!"));
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @PutMapping("/courses/{id}/publish")
    public ResponseEntity<?> toggleCoursePublication(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) return ResponseEntity.notFound().build();

        Boolean published = payload.get("published");
        if (published != null) {
            course.setPublished(published);
            courseRepository.save(course);
        }

        return ResponseEntity.ok(Map.of("message", "Course publication status updated!"));
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> createPlatformAnnouncement(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String content = payload.get("content");

        Announcement announcement = new Announcement(null, title, content);
        announcementRepository.save(announcement);

        return ResponseEntity.ok(Map.of("message", "Announcement broadcasted successfully!"));
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getContactMessages() {
        return ResponseEntity.ok(contactMessageRepository.findAllByOrderByCreatedAtDesc());
    }
}
