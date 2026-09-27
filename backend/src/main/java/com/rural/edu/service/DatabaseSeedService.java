package com.rural.edu.service;

import com.rural.edu.entity.*;
import com.rural.edu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Initializes default system accounts and course data if the database is empty.
 * Preserves all existing data and never overwrites existing records.
 */
@Service
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

        if (categoryRepository.count() == 0) {
            CourseCategory math = categoryRepository.save(new CourseCategory("Mathematics", "Fundamental & advanced math for school students", "calculator"));
            CourseCategory science = categoryRepository.save(new CourseCategory("Science & Technology", "Physics, Chemistry, Biology & basic computer literacy", "atom"));
            CourseCategory english = categoryRepository.save(new CourseCategory("English & Communication", "Grammar, spoken English & reading skills", "book-open"));
            CourseCategory vocational = categoryRepository.save(new CourseCategory("Vocational Skills", "Practical agricultural science & digital tools", "briefcase"));

            Teacher teacher = teacherRepository.findAll().stream().findFirst().orElse(null);
            Student student = studentRepository.findAll().stream().findFirst().orElse(null);

            if (teacher != null && courseRepository.count() == 0) {
                Course c1 = courseRepository.save(new Course("Basic Mathematics for Rural High Schools", "Comprehensive guide covering Algebra, Geometry, Arithmetic, and real-world math applications designed for rural students.", math, teacher, "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80"));
                Course c2 = courseRepository.save(new Course("Introduction to Agriculture & Plant Science", "Learn modern farming techniques, soil health management, crop protection, and sustainable agricultural science.", vocational, teacher, "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80"));
                Course c3 = courseRepository.save(new Course("Digital Literacy & Basic Computers", "Master fundamental computer operations, internet browsing, email communication, and online safety.", science, teacher, "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80"));
                Course c4 = courseRepository.save(new Course("Class 10 General Science & Physics Foundations", "Explore Laws of Motion, Electricity, Chemical Reactions, and Human Anatomy aligned with Class 10 NCERT curriculum.", science, teacher, "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"));
                Course c5 = courseRepository.save(new Course("Spoken English & Communication Skills for Rural Youth", "Develop confidence in everyday English conversation, grammar fundamentals, vocabulary building, and interview preparation.", english, teacher, "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80"));
                Course c6 = courseRepository.save(new Course("Financial Literacy & Digital Payments for Rural Communities", "Learn smart budgeting, bank savings accounts, safe UPI digital transactions, micro-loans, and crop insurance schemes.", vocational, teacher, "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80"));

                if (student != null) {
                    enrollmentRepository.save(new Enrollment(student, c1));
                    enrollmentRepository.save(new Enrollment(student, c2));
                    enrollmentRepository.save(new Enrollment(student, c3));
                    enrollmentRepository.save(new Enrollment(student, c4));
                    enrollmentRepository.save(new Enrollment(student, c5));
                    enrollmentRepository.save(new Enrollment(student, c6));
                }
            }
        }

        System.out.println("🌱 Initialized Rural Education Platform Default Seed Accounts!");
    }
}
