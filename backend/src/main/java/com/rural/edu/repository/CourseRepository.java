package com.rural.edu.repository;

import com.rural.edu.entity.Course;
import com.rural.edu.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByPublishedTrue();
    long countByPublishedTrue();
    List<Course> findByTeacher(Teacher teacher);
    List<Course> findByTeacherId(Long teacherId);
    List<Course> findByCategoryIdAndPublishedTrue(Long categoryId);
    
    @Query("SELECT c FROM Course c WHERE c.published = true AND (LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Course> searchCourses(@Param("keyword") String keyword);
}
