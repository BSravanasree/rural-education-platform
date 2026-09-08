package com.rural.edu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "grade_level", length = 50)
    private String gradeLevel;

    @Column(name = "school_name", length = 150)
    private String schoolName;

    @Column(name = "village_district", length = 150)
    private String villageDistrict;

    public Student() {}

    public Student(User user, String gradeLevel, String schoolName, String villageDistrict) {
        this.user = user;
        this.gradeLevel = gradeLevel;
        this.schoolName = schoolName;
        this.villageDistrict = villageDistrict;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getSchoolName() { return schoolName; }
    public void setSchoolName(String schoolName) { this.schoolName = schoolName; }

    public String getVillageDistrict() { return villageDistrict; }
    public void setVillageDistrict(String villageDistrict) { this.villageDistrict = villageDistrict; }
}
