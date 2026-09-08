package com.rural.edu.repository;

import com.rural.edu.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentId(Long studentId);
    List<Submission> findByAssignmentId(Long assignmentId);
    Optional<Submission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    List<Submission> findByAssignmentLessonCourseTeacherId(Long teacherId);
    long countByAssignmentLessonCourseTeacherIdAndMarksObtainedIsNull(Long teacherId);
}
