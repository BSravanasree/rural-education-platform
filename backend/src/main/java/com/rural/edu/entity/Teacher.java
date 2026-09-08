package com.rural.edu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String qualification;

    @Column(name = "subject_specialization", length = 100)
    private String subjectSpecialization;

    @Column(columnDefinition = "TEXT")
    private String bio;

    public Teacher() {}

    public Teacher(User user, String qualification, String subjectSpecialization, String bio) {
        this.user = user;
        this.qualification = qualification;
        this.subjectSpecialization = subjectSpecialization;
        this.bio = bio;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getSubjectSpecialization() { return subjectSpecialization; }
    public void setSubjectSpecialization(String subjectSpecialization) { this.subjectSpecialization = subjectSpecialization; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
