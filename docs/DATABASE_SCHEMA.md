# Database Schema Summary — Rural Education Platform

## MySQL Relational Tables & Relationships

```
users (id, email, password, full_name, phone, role, active, preferred_language, created_at)
  ├── students (id, user_id, grade_level, school_name, village_district)
  ├── teachers (id, user_id, qualification, subject_specialization, bio)
  └── admins (id, user_id, department)

course_categories (id, name, description, icon_name)
courses (id, title, description, category_id, teacher_id, thumbnail_url, language, difficulty_level, status, published, created_at)
  ├── lessons (id, course_id, title, sequence_order)
  ├── videos (id, course_id, title, video_url, duration_seconds)
  ├── study_materials (id, course_id, title, file_url, file_type)
  ├── quizzes (id, lesson_id, title, total_marks, duration_minutes)
  │    └── questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, points)
  └── assignments (id, lesson_id, title, instructions, deadline, max_marks)

enrollments (id, student_id, course_id, enrolled_at, status) [UNIQUE CONSTRAINT: student_id + course_id]
quiz_attempts (id, quiz_id, student_id, score, total_questions, correct_answers, attempted_at)
submissions (id, assignment_id, student_id, file_url, submission_text, marks_obtained, feedback, submitted_at)
student_progress (id, student_id, video_id, lesson_id, completed, last_watched_position, updated_at)
announcements (id, course_id, title, content, created_at)
testimonials (id, name, role, quote, rating, avatar_url)
```

## Indexes
- `users`: `email` (UNIQUE), `role`
- `enrollments`: `(student_id, course_id)` (UNIQUE)
- `courses`: `teacher_id`, `category_id`, `published`
- `quiz_attempts`: `student_id`, `quiz_id`
- `submissions`: `assignment_id`, `student_id`
