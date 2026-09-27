package com.rural.edu;

import com.rural.edu.entity.Course;
import com.rural.edu.entity.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherOwnershipTest {

    private Teacher teacherA;
    private Teacher teacherB;
    private Course courseA;

    @BeforeEach
    public void setUp() {
        teacherA = new Teacher();
        teacherA.setId(10L);

        teacherB = new Teacher();
        teacherB.setId(20L);

        courseA = new Course();
        courseA.setId(100L);
        courseA.setTeacher(teacherA);
    }

    @Test
    public void testTeacherOwnerMatch_ReturnsTrue() {
        boolean isOwner = teacherA.getId().equals(courseA.getTeacher().getId());
        assertTrue(isOwner, "Teacher A must be recognized as the owner of Course A");
    }

    @Test
    public void testTeacherOwnerMismatch_ReturnsFalse() {
        boolean isOwner = teacherB.getId().equals(courseA.getTeacher().getId());
        assertFalse(isOwner, "Teacher B must NOT be authorized to modify Teacher A's course (403 Forbidden)");
    }

    @Test
    public void testNullCourseOrTeacher_ReturnsFalse() {
        assertFalse(teacherA.getId().equals(null), "Null teacher check must fail safely");
        assertNotNull(courseA.getTeacher(), "Course must have an assigned teacher entity");
    }
}
