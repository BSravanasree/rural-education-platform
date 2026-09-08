package com.rural.edu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "testimonials")
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName;

    @Column(name = "role_description", length = 100)
    private String roleDescription;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private Integer rating = 5;

    @Column(name = "avatar_url")
    private String avatarUrl;

    public Testimonial() {}

    public Testimonial(String authorName, String roleDescription, String content, Integer rating, String avatarUrl) {
        this.authorName = authorName;
        this.roleDescription = roleDescription;
        this.content = content;
        this.rating = rating;
        this.avatarUrl = avatarUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getRoleDescription() { return roleDescription; }
    public void setRoleDescription(String roleDescription) { this.roleDescription = roleDescription; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
