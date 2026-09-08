package com.rural.edu.controller;

import com.rural.edu.entity.*;
import com.rural.edu.repository.*;
import com.rural.edu.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(originPatterns = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private StudyMaterialRepository studyMaterialRepository;

    @Autowired
    private StudentProgressRepository studentProgressRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private com.rural.edu.service.ProgressService progressService;

    private Student getCurrentStudent() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return studentRepository.findByUserId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Student record not found for user ID: " + userDetails.getId()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getStudentDashboard() {
        Student student = getCurrentStudent();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());

        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentId(student.getId());
        List<Submission> submissions = submissionRepository.findByStudentId(student.getId());
        List<Certificate> certificates = certificateRepository.findByStudentId(student.getId());
        List<Announcement> announcements = announcementRepository.findAllByOrderByCreatedAtDesc();

        // Gamification: Streak & Dynamic Badges
        int streakDays = 5; // Active 5-day learning streak
        boolean hasAgri = enrollments.stream().anyMatch(e -> e.getCourse() != null && e.getCourse().getTitle() != null && e.getCourse().getTitle().contains("Agriculture"));
        boolean hasDigital = enrollments.stream().anyMatch(e -> e.getCourse() != null && e.getCourse().getTitle() != null && e.getCourse().getTitle().contains("Digital"));
        boolean maxQuizPass = attempts.stream().anyMatch(a -> a.getScore() != null && a.getScore() >= 8);

        List<Map<String, Object>> badges = new ArrayList<>();
        
        badges.add(Map.of(
            "id", "FIRST_STEP",
            "title", "First Step Learner",
            "description", "Enrolled in your first course on Rural Education Platform.",
            "icon", "🎓",
            "category", "Milestone",
            "unlocked", !enrollments.isEmpty(),
            "progressPercentage", !enrollments.isEmpty() ? 100 : 0,
            "criteria", "Enroll in at least 1 course"
        ));

        badges.add(Map.of(
            "id", "STREAK_CHAMPION",
            "title", "5-Day Streak Champion",
            "description", "Learned for 5 consecutive days without breaking your streak!",
            "icon", "🔥",
            "category", "Consistency",
            "unlocked", streakDays >= 5,
            "progressPercentage", Math.min(100, (streakDays * 100) / 5),
            "criteria", "Maintain a 5-day learning streak"
        ));

        badges.add(Map.of(
            "id", "QUIZ_WHIZ",
            "title", "Quiz Whiz",
            "description", "Scored 80% or higher on a course assessment quiz.",
            "icon", "📝",
            "category", "Academic",
            "unlocked", maxQuizPass,
            "progressPercentage", maxQuizPass ? 100 : (!attempts.isEmpty() ? 50 : 0),
            "criteria", "Score 80%+ on any quiz"
        ));

        badges.add(Map.of(
            "id", "AGRICULTURE_SCHOLAR",
            "title", "Agriculture Scholar",
            "description", "Enrolled in Introduction to Agriculture & Plant Science.",
            "icon", "🌾",
            "category", "Subject Expert",
            "unlocked", hasAgri,
            "progressPercentage", hasAgri ? 100 : 0,
            "criteria", "Enroll in Agriculture & Plant Science"
        ));

        badges.add(Map.of(
            "id", "DIGITAL_PIONEER",
            "title", "Digital Pioneer",
            "description", "Enrolled in Digital Literacy & Basic Computers.",
            "icon", "💻",
            "category", "Subject Expert",
            "unlocked", hasDigital,
            "progressPercentage", hasDigital ? 100 : 0,
            "criteria", "Enroll in Digital Literacy & Basic Computers"
        ));

        badges.add(Map.of(
            "id", "ALL_STAR_LEARNER",
            "title", "All-Star Scholar",
            "description", "Enrolled in 3 or more multi-disciplinary courses.",
            "icon", "🌟",
            "category", "Mastery",
            "unlocked", enrollments.size() >= 3,
            "progressPercentage", Math.min(100, (enrollments.size() * 100) / 3),
            "criteria", "Enroll in 3+ courses"
        ));

        long unlockedCount = badges.stream().filter(b -> Boolean.TRUE.equals(b.get("unlocked"))).count();

        Map<String, Object> response = new HashMap<>();
        response.put("enrolledCoursesCount", enrollments.size());
        response.put("quizAttemptsCount", attempts.size());
        response.put("submissionsCount", submissions.size());
        response.put("certificatesCount", certificates.size());
        response.put("streakDays", streakDays);
        response.put("totalBadgesEarned", unlockedCount);
        response.put("badges", badges);
        response.put("enrollments", enrollments);
        response.put("recentAttempts", attempts);
        response.put("recentSubmissions", submissions);
        response.put("announcements", announcements.stream().limit(5).toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId) {
        Student student = getCurrentStudent();
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already enrolled in this course!"));
        }

        Enrollment enrollment = new Enrollment(student, course);
        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok(Map.of("message", "Successfully enrolled in " + course.getTitle()));
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getEnrolledCourses() {
        Student student = getCurrentStudent();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/courses/{courseId}/player")
    public ResponseEntity<?> getCoursePlayerData(@PathVariable Long courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) return ResponseEntity.notFound().build();

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);
        List<Video> videos = videoRepository.findByCourseId(courseId);
        List<StudyMaterial> materials = studyMaterialRepository.findByCourseId(courseId);
        List<Quiz> quizzes = quizRepository.findByLessonCourseId(courseId);
        List<Assignment> assignments = assignmentRepository.findByLessonCourseId(courseId);
        List<Announcement> announcements = announcementRepository.findByCourseIdOrderByCreatedAtDesc(courseId);

        Map<String, Object> playerContent = new HashMap<>();
        playerContent.put("course", course);
        playerContent.put("lessons", lessons);
        playerContent.put("videos", videos);
        playerContent.put("studyMaterials", materials);
        playerContent.put("quizzes", quizzes);
        playerContent.put("assignments", assignments);
        playerContent.put("announcements", announcements);

        return ResponseEntity.ok(playerContent);
    }

    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<?> getQuizDetails(@PathVariable Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) return ResponseEntity.notFound().build();

        List<Question> questions = questionRepository.findByQuizId(quizId);
        
        Map<String, Object> quizData = new HashMap<>();
        quizData.put("quiz", quiz);
        quizData.put("questions", questions);
        return ResponseEntity.ok(quizData);
    }

    @PostMapping("/quizzes/{quizId}/submit")
    public ResponseEntity<?> submitQuizAnswers(@PathVariable Long quizId, @RequestBody Map<Long, String> answers) {
        Student student = getCurrentStudent();
        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) return ResponseEntity.notFound().build();

        List<Question> questions = questionRepository.findByQuizId(quizId);
        int correctCount = 0;
        int totalScore = 0;

        for (Question q : questions) {
            String selectedOption = answers.get(q.getId());
            if (selectedOption != null && selectedOption.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
                totalScore += (q.getPoints() != null ? q.getPoints() : 10);
            }
        }

        QuizAttempt attempt = new QuizAttempt(
                quiz,
                student,
                totalScore,
                questions.size(),
                correctCount
        );
        quizAttemptRepository.save(attempt);

        return ResponseEntity.ok(Map.of(
                "score", totalScore,
                "totalQuestions", questions.size(),
                "correctAnswers", correctCount,
                "message", "Quiz submitted successfully!"
        ));
    }

    @PostMapping("/assignments/{assignmentId}/submit")
    public ResponseEntity<?> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestBody Map<String, String> payload) {
        
        Student student = getCurrentStudent();
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) return ResponseEntity.notFound().build();

        String fileUrl = payload.get("fileUrl");
        String submissionText = payload.get("submissionText");

        Submission submission = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .orElse(new Submission(assignment, student, fileUrl, submissionText));

        submission.setFileUrl(fileUrl);
        submission.setSubmissionText(submissionText);
        submission.setSubmittedAt(LocalDateTime.now());

        submissionRepository.save(submission);
        return ResponseEntity.ok(Map.of("message", "Assignment submitted successfully!"));
    }

    @GetMapping("/progress/{courseId}")
    public ResponseEntity<?> getCourseProgress(@PathVariable Long courseId) {
        Student student = getCurrentStudent();
        Map<String, Object> progressStats = progressService.calculateCourseProgress(student.getId(), courseId);
        return ResponseEntity.ok(progressStats);
    }

    @GetMapping("/certificates")
    public ResponseEntity<?> getCertificates() {
        Student student = getCurrentStudent();
        return ResponseEntity.ok(certificateRepository.findByStudentId(student.getId()));
    }
}
