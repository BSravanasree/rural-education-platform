package com.rural.edu.repository;

import com.rural.edu.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    List<Announcement> findByCourseIsNullOrderByCreatedAtDesc();
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
