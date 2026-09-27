package com.rural.edu.service;

import com.rural.edu.entity.*;
import com.rural.edu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Seed data runner for local development and testing environments only.
 * Disabled in production profile ('prod') to enforce production database security and privacy.
 */
@Service
@Profile({"dev", "default"})
public class DatabaseSeedService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CourseCategoryRepository categoryRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private StudyMaterialRepository studyMaterialRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@ruraledu.org")) {
            User adminUser = userRepository.save(new User("admin@ruraledu.org", encoder.encode("admin123"), "System Administrator", "9876543210", Role.ROLE_ADMIN));
            adminRepository.save(new Admin(adminUser, "Main Office"));
        }

        if (!userRepository.existsByEmail("teacher@ruraledu.org")) {
            User teacherUser = userRepository.save(new User("teacher@ruraledu.org", encoder.encode("teacher123"), "Prof. Rajesh Kumar", "9876543211", Role.ROLE_TEACHER));
            teacherRepository.save(new Teacher(teacherUser, "M.Sc Mathematics, B.Ed", "Science & Mathematics", "Passionate teacher for rural students."));
        }

        if (!userRepository.existsByEmail("student@ruraledu.org")) {
            User studentUser = userRepository.save(new User("student@ruraledu.org", encoder.encode("student123"), "Ananya Sharma", "9876543212", Role.ROLE_STUDENT));
            studentRepository.save(new Student(studentUser, "Class 10", "Govt High School Rampur", "Rampur, MP"));
        }

        System.out.println("🌱 Initialized Rural Education Platform Development Seed Data...");
    }
}
