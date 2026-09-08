package com.rural.edu.dto;

import java.util.List;
import java.util.Map;

public class ParentReportDTO {
    private String studentName;
    private String schoolName;
    private String gradeLevel;
    private String studentEmail;
    private int enrolledCoursesCount;
    private int completedCoursesCount;
    private int overallProgressPercentage;
    private int streakDays;
    private int totalQuizzesTaken;
    private double averageQuizScore;
    private List<Map<String, Object>> courseProgressList;
    private List<Map<String, Object>> recentQuizScores;

    public ParentReportDTO() {}

    public ParentReportDTO(String studentName, String schoolName, String gradeLevel, String studentEmail, 
                           int enrolledCoursesCount, int completedCoursesCount, int overallProgressPercentage, 
                           int streakDays, int totalQuizzesTaken, double averageQuizScore, 
                           List<Map<String, Object>> courseProgressList, List<Map<String, Object>> recentQuizScores) {
        this.studentName = studentName;
        this.schoolName = schoolName;
        this.gradeLevel = gradeLevel;
        this.studentEmail = studentEmail;
        this.enrolledCoursesCount = enrolledCoursesCount;
        this.completedCoursesCount = completedCoursesCount;
        this.overallProgressPercentage = overallProgressPercentage;
        this.streakDays = streakDays;
        this.totalQuizzesTaken = totalQuizzesTaken;
        this.averageQuizScore = averageQuizScore;
        this.courseProgressList = courseProgressList;
        this.recentQuizScores = recentQuizScores;
    }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getSchoolName() { return schoolName; }
    public void setSchoolName(String schoolName) { this.schoolName = schoolName; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public int getEnrolledCoursesCount() { return enrolledCoursesCount; }
    public void setEnrolledCoursesCount(int enrolledCoursesCount) { this.enrolledCoursesCount = enrolledCoursesCount; }

    public int getCompletedCoursesCount() { return completedCoursesCount; }
    public void setCompletedCoursesCount(int completedCoursesCount) { this.completedCoursesCount = completedCoursesCount; }

    public int getOverallProgressPercentage() { return overallProgressPercentage; }
    public void setOverallProgressPercentage(int overallProgressPercentage) { this.overallProgressPercentage = overallProgressPercentage; }

    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) { this.streakDays = streakDays; }

    public int getTotalQuizzesTaken() { return totalQuizzesTaken; }
    public void setTotalQuizzesTaken(int totalQuizzesTaken) { this.totalQuizzesTaken = totalQuizzesTaken; }

    public double getAverageQuizScore() { return averageQuizScore; }
    public void setAverageQuizScore(double averageQuizScore) { this.averageQuizScore = averageQuizScore; }

    public List<Map<String, Object>> getCourseProgressList() { return courseProgressList; }
    public void setCourseProgressList(List<Map<String, Object>> courseProgressList) { this.courseProgressList = courseProgressList; }

    public List<Map<String, Object>> getRecentQuizScores() { return recentQuizScores; }
    public void setRecentQuizScores(List<Map<String, Object>> recentQuizScores) { this.recentQuizScores = recentQuizScores; }
}
