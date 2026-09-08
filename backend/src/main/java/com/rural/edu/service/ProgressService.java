package com.rural.edu.service;

import com.rural.edu.entity.*;
import com.rural.edu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProgressService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private StudentProgressRepository studentProgressRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    public Map<String, Object> calculateCourseProgress(Long studentId, Long courseId) {
        long totalLessons = lessonRepository.findByCourseIdOrderBySequenceOrderAsc(courseId).size();
        long totalVideos = videoRepository.findByCourseId(courseId).size();
        long totalQuizzes = quizRepository.findByLessonCourseId(courseId).size();
        long totalAssignments = assignmentRepository.findByLessonCourseId(courseId).size();

        long totalActivities = totalLessons + totalVideos + totalQuizzes + totalAssignments;

        if (totalActivities == 0) {
            Map<String, Object> result = new HashMap<>();
            result.put("progressPercentage", 0);
            result.put("completedActivities", 0);
            result.put("totalActivities", 0);
            return result;
        }

        long completedLessonsAndVideos = studentProgressRepository.findByStudentId(studentId).stream()
                .filter(StudentProgress::isCompleted)
                .filter(sp -> (sp.getLesson() != null && sp.getLesson().getCourse().getId().equals(courseId)) ||
                              (sp.getVideo() != null && sp.getVideo().getCourse().getId().equals(courseId)))
                .count();

        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentId(studentId);
        long completedQuizzes = attempts.stream()
                .filter(qa -> qa.getQuiz() != null && qa.getQuiz().getLesson() != null &&
                              qa.getQuiz().getLesson().getCourse().getId().equals(courseId))
                .map(qa -> qa.getQuiz().getId())
                .distinct()
                .count();

        List<Submission> submissions = submissionRepository.findByStudentId(studentId);
        long completedAssignments = submissions.stream()
                .filter(sub -> sub.getAssignment() != null && sub.getAssignment().getLesson() != null &&
                               sub.getAssignment().getLesson().getCourse().getId().equals(courseId))
                .map(sub -> sub.getAssignment().getId())
                .distinct()
                .count();

        long completedActivities = completedLessonsAndVideos + completedQuizzes + completedAssignments;
        int progressPercentage = (int) Math.min(100, Math.round(((double) completedActivities / totalActivities) * 100.0));

        Map<String, Object> result = new HashMap<>();
        result.put("progressPercentage", progressPercentage);
        result.put("completedActivities", completedActivities);
        result.put("totalActivities", totalActivities);
        result.put("completedLessonsAndVideos", completedLessonsAndVideos);
        result.put("completedQuizzes", completedQuizzes);
        result.put("completedAssignments", completedAssignments);

        return result;
    }
}
