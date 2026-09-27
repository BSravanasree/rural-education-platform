package com.rural.edu.controller;

import com.rural.edu.dto.ContactRequest;
import com.rural.edu.entity.ContactMessage;
import com.rural.edu.entity.Course;
import com.rural.edu.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(originPatterns = "*")
public class PublicController {

    @Autowired
    private CourseCategoryRepository categoryRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/quizzes")
    public ResponseEntity<?> getPublicQuizzes() {
        return ResponseEntity.ok(quizRepository.findAll());
    }

    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<?> getPublicQuizDetails(@PathVariable Long quizId) {
        return quizRepository.findById(quizId).map(quiz -> {
            Map<String, Object> quizData = new HashMap<>();
            quizData.put("quiz", quiz);
            quizData.put("questions", questionRepository.findByQuizId(quizId));
            return ResponseEntity.ok(quizData);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getPublicStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCourses", courseRepository.countByPublishedTrue());
        stats.put("totalCategories", categoryRepository.count());
        stats.put("totalTestimonials", testimonialRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getPublicCourses(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(courseRepository.searchCourses(search.trim()));
        }
        if (categoryId != null) {
            return ResponseEntity.ok(courseRepository.findByCategoryIdAndPublishedTrue(categoryId));
        }
        return ResponseEntity.ok(courseRepository.findByPublishedTrue());
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/testimonials")
    public ResponseEntity<?> getTestimonials() {
        return ResponseEntity.ok(testimonialRepository.findAll());
    }

    @GetMapping("/announcements")
    public ResponseEntity<?> getSystemAnnouncements() {
        return ResponseEntity.ok(announcementRepository.findByCourseIsNullOrderByCreatedAtDesc());
    }

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactRequest contactRequest) {
        ContactMessage msg = new ContactMessage(
                contactRequest.getName(),
                contactRequest.getEmail(),
                contactRequest.getSubject(),
                contactRequest.getMessage()
        );
        contactMessageRepository.save(msg);
        return ResponseEntity.ok(Map.of("message", "Thank you for contacting us! We will get back to you shortly."));
    }
}
