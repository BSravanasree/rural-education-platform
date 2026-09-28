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
        // 1. Ensure Default Demo Users exist
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

        Teacher teacher = teacherRepository.findAll().stream().findFirst().orElse(null);
        Student student = studentRepository.findAll().stream().findFirst().orElse(null);

        // 2. Populate Categories if empty
        CourseCategory math = categoryRepository.findAll().stream().filter(c -> c.getName().equals("Mathematics")).findFirst().orElse(null);
        if (math == null) math = categoryRepository.save(new CourseCategory("Mathematics", "Fundamental & advanced math for school students", "calculator"));

        CourseCategory science = categoryRepository.findAll().stream().filter(c -> c.getName().contains("Science")).findFirst().orElse(null);
        if (science == null) science = categoryRepository.save(new CourseCategory("Science & Technology", "Physics, Chemistry, Biology & basic computer literacy", "atom"));

        CourseCategory english = categoryRepository.findAll().stream().filter(c -> c.getName().contains("English")).findFirst().orElse(null);
        if (english == null) english = categoryRepository.save(new CourseCategory("English & Communication", "Grammar, spoken English & reading skills", "book-open"));

        CourseCategory vocational = categoryRepository.findAll().stream().filter(c -> c.getName().contains("Vocational")).findFirst().orElse(null);
        if (vocational == null) vocational = categoryRepository.save(new CourseCategory("Vocational Skills", "Practical agricultural science & digital tools", "briefcase"));

        // 3. Populate Courses if empty
        if (courseRepository.count() == 0 && teacher != null) {
            courseRepository.save(new Course("Basic Mathematics for Rural High Schools", "Comprehensive guide covering Algebra, Geometry, Arithmetic, and real-world math applications designed for rural students.", math, teacher, "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80"));
            courseRepository.save(new Course("Introduction to Agriculture & Plant Science", "Learn modern farming techniques, soil health management, crop protection, and sustainable agricultural science.", vocational, teacher, "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80"));
            courseRepository.save(new Course("Digital Literacy & Basic Computers", "Master fundamental computer operations, internet browsing, email communication, and online safety.", science, teacher, "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80"));
            courseRepository.save(new Course("Class 10 General Science & Physics Foundations", "Explore Laws of Motion, Electricity, Chemical Reactions, and Human Anatomy aligned with Class 10 NCERT curriculum.", science, teacher, "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"));
            courseRepository.save(new Course("Spoken English & Communication Skills for Rural Youth", "Develop confidence in everyday English conversation, grammar fundamentals, vocabulary building, and interview preparation.", english, teacher, "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80"));
            courseRepository.save(new Course("Financial Literacy & Digital Payments for Rural Communities", "Learn smart budgeting, bank savings accounts, safe UPI digital transactions, micro-loans, and crop insurance schemes.", vocational, teacher, "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80"));
        }

        // 4. Enroll Student in all courses
        if (student != null && enrollmentRepository.count() == 0) {
            for (Course c : courseRepository.findAll()) {
                enrollmentRepository.save(new Enrollment(student, c));
            }
        }

        // 5. Populate Lessons, Multilingual YouTube Videos, PDF Notes & Quizzes for Course 1 (Mathematics)
        Course course1 = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("Mathematics")).findFirst().orElse(null);
        if (course1 != null && lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course1.getId()).isEmpty()) {
            Lesson lesson1 = lessonRepository.save(new Lesson(course1, "Lesson 1: Introduction to Linear Equations & Algebra", 1));
            lessonRepository.save(new Lesson(course1, "Lesson 2: Quadratic Equations & Polynomials", 2));
            lessonRepository.save(new Lesson(course1, "Lesson 3: Trigonometry & Real-World Heights Measurement", 3));

            videoRepository.save(new Video(course1, "Class 10 Mathematics: Full Chapter Lecture (English Medium)", "https://www.youtube.com/embed/Veb22xD0Ao0", 1200));
            videoRepository.save(new Video(course1, "Class 10 Mathematics: Complete Chapter Explanation (Hindi Medium - हिंदी)", "https://www.youtube.com/embed/IhzV-JkJncc", 1800));
            videoRepository.save(new Video(course1, "Class 10 Mathematics: Complete Chapter Explanation (Telugu - తెలుగు)", "https://www.youtube.com/embed/yDG7g08aGtg", 1500));

            studyMaterialRepository.save(new StudyMaterial(course1, "Class 10 Mathematics NCERT Full Chapter Textbook.pdf", "https://ncert.nic.in/textbook/pdf/jemh101.pdf", "PDF Textbook"));
            studyMaterialRepository.save(new StudyMaterial(course1, "Class 10 Mathematics Formula Reference Sheet.pdf", "https://ncert.nic.in/textbook/pdf/jemh1ps.pdf", "PDF Notes"));
            studyMaterialRepository.save(new StudyMaterial(course1, "Class 10 Mathematics Chapterwise Practice Workbook.pdf", "https://ncert.nic.in/textbook/pdf/jemh102.pdf", "PDF Workbook"));

            Quiz quiz1 = quizRepository.save(new Quiz(lesson1, "Linear Equations Basics Quiz", 20, 15));
            questionRepository.save(new Question(quiz1, "What is the solution to 2x + 4 = 10?", "x = 2", "x = 3", "x = 4", "x = 5", "B", 10));
            questionRepository.save(new Question(quiz1, "What is the slope intercept form of a line?", "y = mx + c", "a^2 + b^2 = c^2", "x/a + y/b = 1", "y = ax^2", "A", 10));

            assignmentRepository.save(new Assignment(lesson1, "Algebraic Equations Workbook Exercises", "Solve questions 1 through 10 from the Class 10 Math Practice Workbook.", LocalDateTime.now().plusDays(7), 100));
        }

        // 6. Populate Course 2: Agriculture & Plant Science
        Course course2 = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("Agriculture")).findFirst().orElse(null);
        if (course2 != null && lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course2.getId()).isEmpty()) {
            Lesson agLesson1 = lessonRepository.save(new Lesson(course2, "Lesson 1: Modern Soil Health & Fertilizer Management", 1));
            videoRepository.save(new Video(course2, "Agriculture: Plant Science & Farming Guide (English Medium)", "https://www.youtube.com/embed/IDfSPPqVdUw", 1800));
            videoRepository.save(new Video(course2, "Agriculture: Crop Protection & Soil Health (Telugu Medium - తెలుగు)", "https://www.youtube.com/embed/LMdJC10IM48", 1500));
            videoRepository.save(new Video(course2, "Agriculture: Sustainable Farming & Botany (Hindi Medium - हिंदी)", "https://www.youtube.com/embed/rkEunryaCJg", 1600));

            studyMaterialRepository.save(new StudyMaterial(course2, "Class 10 Science & Agriculture NCERT Full Textbook.pdf", "https://ncert.nic.in/textbook/pdf/jesc101.pdf", "PDF Textbook"));
            studyMaterialRepository.save(new StudyMaterial(course2, "MANAGE India Natural Farming Video Resource Portal (Telugu).pdf", "https://www.manage.gov.in/NaturalFarming/VideoLinks.aspx", "External Resource"));
            studyMaterialRepository.save(new StudyMaterial(course2, "FAO Plant Production & Protection Multimedia Guide.pdf", "https://www.fao.org/plant-production-protection/resources/multimedia/en", "External Resource"));
            studyMaterialRepository.save(new StudyMaterial(course2, "SARE Soil Health Principles & Practical Field Workbook.pdf", "https://www.sare.org/resources/soil-health-principles-and-practices-videos/", "PDF Workbook"));

            Quiz agQuiz = quizRepository.save(new Quiz(agLesson1, "Soil Health & Fertilizer Quiz", 20, 15));
            questionRepository.save(new Question(agQuiz, "Which primary nutrient promotes leafy green growth in plants?", "Phosphorus (P)", "Nitrogen (N)", "Potassium (K)", "Calcium (Ca)", "B", 10));
        }

        // 7. Populate Course 3: Digital Literacy & Basic Computers
        Course course3 = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("Digital")).findFirst().orElse(null);
        if (course3 != null && lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course3.getId()).isEmpty()) {
            Lesson compLesson1 = lessonRepository.save(new Lesson(course3, "Lesson 1: Computer Hardware & Operating System Basics", 1));
            videoRepository.save(new Video(course3, "Digital Literacy & Basic Computers (English Medium)", "https://www.youtube.com/embed/y2kg3MOk1sY", 1200));
            videoRepository.save(new Video(course3, "Digital Literacy & Basic Computers Full Guide (Telugu Medium - తెలుగు)", "https://www.youtube.com/embed/74HdtG8qneI", 1400));
            videoRepository.save(new Video(course3, "Digital Literacy & Computer Basics (Hindi Medium - हिंदी)", "https://www.youtube.com/embed/agaLaSafbwc", 1300));

            studyMaterialRepository.save(new StudyMaterial(course3, "Class 10 Information Technology & Computer Science Textbook.pdf", "https://ncert.nic.in/textbook/pdf/jett101.pdf", "PDF Textbook"));

            Quiz compQuiz = quizRepository.save(new Quiz(compLesson1, "Computer Fundamentals & Keyboard Quiz", 20, 15));
            questionRepository.save(new Question(compQuiz, "What does CPU stand for in computer hardware?", "Central Processing Unit", "Computer Power Unit", "Central Printing Utility", "Control Program Unit", "A", 10));
        }

        // 8. Populate Course 4: Class 10 General Science
        Course course4 = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("General Science")).findFirst().orElse(null);
        if (course4 != null && lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course4.getId()).isEmpty()) {
            Lesson sciLesson1 = lessonRepository.save(new Lesson(course4, "Lesson 1: Chemical Reactions & Equations", 1));
            videoRepository.save(new Video(course4, "Class 10 General Science & Physics Foundations (English & Hindi)", "https://www.youtube.com/embed/g1p-5XcHRCs", 1800));
            videoRepository.save(new Video(course4, "Class 10 General Science & Physics Foundations (Telugu Medium - తెలుగు)", "https://www.youtube.com/embed/yR2u6ub_5-Y", 1900));

            studyMaterialRepository.save(new StudyMaterial(course4, "Class 10 General Science NCERT Full Textbook.pdf", "https://ncert.nic.in/textbook/pdf/jesc101.pdf", "PDF Textbook"));

            Quiz sciQuiz = quizRepository.save(new Quiz(sciLesson1, "Chemical Reactions Quiz", 20, 15));
            questionRepository.save(new Question(sciQuiz, "What type of reaction absorbs heat energy?", "Exothermic", "Endothermic", "Combustion", "Displacement", "B", 10));
        }

        // 9. Populate Course 5: Spoken English
        Course course5 = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("Spoken English")).findFirst().orElse(null);
        if (course5 != null && lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course5.getId()).isEmpty()) {
            Lesson engLesson1 = lessonRepository.save(new Lesson(course5, "Lesson 1: Daily Conversation & Greetings", 1));
            videoRepository.save(new Video(course5, "Spoken English & Communication Skills (English & Hindi)", "https://www.youtube.com/embed/PoEYp5uZDgA", 1500));
            videoRepository.save(new Video(course5, "Spoken English Grammar & Daily Conversation Practice (Telugu Medium - తెలుగు)", "https://www.youtube.com/embed/lkVly5flOX8", 1600));

            studyMaterialRepository.save(new StudyMaterial(course5, "Spoken English Practice Guidebook & Grammar Rules.pdf", "https://ncert.nic.in/textbook/pdf/jett101.pdf", "PDF Guidebook"));

            Quiz engQuiz = quizRepository.save(new Quiz(engLesson1, "English Greetings & Grammar Quiz", 20, 15));
            questionRepository.save(new Question(engQuiz, "Which sentence is grammatically correct?", "He go to school.", "He goes to school.", "He going to school.", "He gone to school.", "B", 10));
        }

        // 10. Populate Course 6: Financial Literacy & UPI
        Course course6 = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("Financial Literacy")).findFirst().orElse(null);
        if (course6 != null && lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course6.getId()).isEmpty()) {
            Lesson finLesson1 = lessonRepository.save(new Lesson(course6, "Lesson 1: Savings, Banking & UPI Security", 1));
            videoRepository.save(new Video(course6, "Digital Payments Safety & UPI Fraud Awareness Guide", "https://www.youtube.com/embed/l8X_1T-N4-8", 800));

            studyMaterialRepository.save(new StudyMaterial(course6, "Rural Banking & Financial Schemes Guidebook.pdf", "https://ncert.nic.in/textbook/pdf/jemh101.pdf", "PDF Guidebook"));

            Quiz finQuiz = quizRepository.save(new Quiz(finLesson1, "UPI & Online Banking Safety Quiz", 20, 15));
            questionRepository.save(new Question(finQuiz, "Should you ever share your 4-digit UPI PIN with anyone?", "Yes, with family", "Yes, with bank manager", "No, never share PIN", "Yes, on SMS", "C", 10));
        }

        // 11. Announcements
        if (announcementRepository.count() == 0) {
            Course course1Ref = courseRepository.findAll().stream().filter(c -> c.getTitle().contains("Mathematics")).findFirst().orElse(null);
            announcementRepository.save(new Announcement(course1Ref, "Welcome to Math for Rural High Schools!", "Classes start this week. Please download the formula sheet and check lesson 1 video lectures."));
            announcementRepository.save(new Announcement(null, "Platform Update: 6 New Courses Published!", "We have published new courses in Science, Spoken English, Financial Literacy, Agriculture, and Computer Science."));
        }

        // 12. Testimonials
        if (testimonialRepository.count() == 0) {
            testimonialRepository.save(new Testimonial("Sunita Devi", "Student, MP", "This platform helped me learn Mathematics step-by-step even with low internet speed. The video lectures and PDF notes are clear and super helpful!", 5, "https://randomuser.me/api/portraits/women/44.jpg"));
            testimonialRepository.save(new Testimonial("Rameshwar Singh", "Teacher, Rajasthan", "Teaching online to students in remote villages was a dream. With Rural Education Platform, I can manage quizzes, upload notes, and guide hundreds of students easily.", 5, "https://randomuser.me/api/portraits/men/32.jpg"));
        }

        System.out.println("✅ Seed Data Initialization Complete with Multilingual YouTube Videos, PDF Study Materials, Quizzes & Assignments!");
    }
}
