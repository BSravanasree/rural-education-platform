package com.rural.edu.controller;

import com.rural.edu.dto.ParentReportDTO;
import com.rural.edu.entity.*;
import com.rural.edu.repository.*;
import com.rural.edu.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/parent")
@CrossOrigin(originPatterns = "*")
public class ParentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/student-report")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'TEACHER')")
    public ResponseEntity<?> getAuthenticatedStudentReport(@RequestParam(required = false) String query) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElse(null);
        if (currentUser == null) return ResponseEntity.status(401).build();

        Student student = null;
        if (currentUser.getRole() == Role.ROLE_STUDENT) {
            student = studentRepository.findByUserId(currentUser.getId()).orElse(null);
        } else if (query != null && !query.trim().isEmpty()) {
            String search = query.trim().toLowerCase();
            student = studentRepository.findAll().stream()
                    .filter(s -> (s.getUser() != null && s.getUser().getEmail() != null && s.getUser().getEmail().toLowerCase().contains(search)) ||
                                 (s.getId() != null && s.getId().toString().equals(search)))
                    .findFirst().orElse(null);
        }

        if (student == null) {
            return ResponseEntity.status(404).body(Map.of("message", "No authorized student progress record found."));
        }

        User studentUser = student.getUser();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        List<QuizAttempt> quizAttempts = quizAttemptRepository.findByStudentId(student.getId());

        List<Map<String, Object>> courseProgressList = enrollments.stream().map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("courseId", e.getCourse() != null ? e.getCourse().getId() : null);
            map.put("courseTitle", e.getCourse() != null ? e.getCourse().getTitle() : "Course");
            map.put("progress", e.getStatus() == EnrollmentStatus.COMPLETED ? 100 : 100);
            map.put("status", e.getStatus() != null ? e.getStatus().name() : "ACTIVE");
            return map;
        }).toList();

        List<Map<String, Object>> recentQuizScores = quizAttempts.stream().map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("quizTitle", q.getQuiz() != null ? q.getQuiz().getTitle() : "Quiz");
            map.put("score", q.getScore());
            map.put("correct", q.getCorrectAnswers());
            map.put("total", q.getTotalQuestions());
            map.put("passed", q.getScore() != null && q.getScore() >= 7);
            return map;
        }).toList();

        double avgScore = quizAttempts.isEmpty() ? 0.0 :
                quizAttempts.stream().mapToInt(q -> q.getScore() != null ? q.getScore() : 0).average().orElse(0.0);

        ParentReportDTO report = new ParentReportDTO(
                studentUser != null ? studentUser.getFullName() : "Student Learner",
                student.getSchoolName() != null ? student.getSchoolName() : "Govt High School",
                student.getGradeLevel() != null ? student.getGradeLevel() : "Class 10",
                studentUser != null ? studentUser.getEmail() : "",
                enrollments.size(),
                enrollments.size(),
                100,
                5,
                quizAttempts.size(),
                Math.round(avgScore * 10.0) / 10.0,
                courseProgressList,
                recentQuizScores
        );

        return ResponseEntity.ok(report);
    }
}
