package com.rural.edu.repository;

import com.rural.edu.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {
    List<StudentProgress> findByStudentId(Long studentId);
    Optional<StudentProgress> findByStudentIdAndVideoId(Long studentId, Long videoId);
    long countByStudentIdAndCompletedTrue(Long studentId);
}
