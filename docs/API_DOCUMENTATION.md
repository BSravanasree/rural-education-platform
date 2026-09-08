# REST API Documentation — Rural Education Platform

## Authentication APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register Student account strictly |
| POST | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| GET | `/api/auth/me` | Authenticated | Get current logged-in user profile |

## Student APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/student/dashboard` | Student/Admin | Get enrolled courses, recent attempts, & submissions |
| POST | `/api/student/enroll/{courseId}` | Student | Enroll in a published course |
| GET | `/api/student/courses/{courseId}/player` | Student/Admin | Get video playlist, study notes, quizzes, & assignments |
| GET | `/api/student/quizzes/{quizId}` | Student | Get quiz questions (without answer keys) |
| POST | `/api/student/quizzes/{quizId}/submit` | Student | Submit answers; backend scores & returns results |
| POST | `/api/student/assignments/{id}/submit` | Student | Submit homework text / PDF |
| GET | `/api/student/progress/{courseId}` | Student | Get backend calculated progress percentage |

## Teacher APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/teacher/dashboard` | Teacher/Admin | Overview metrics & assigned courses |
| POST | `/api/teacher/courses` | Teacher/Admin | Create new course |
| POST | `/api/teacher/courses/{id}/lessons` | Teacher | Add lesson to course |
| POST | `/api/teacher/courses/{id}/videos` | Teacher | Add lecture video |
| POST | `/api/teacher/courses/{id}/materials` | Teacher | Add PDF study material |
| POST | `/api/teacher/quizzes` | Teacher | Create quiz with questions & correct answer keys |
| GET | `/api/teacher/submissions` | Teacher/Admin | View student submissions for taught courses |
| PUT | `/api/teacher/submissions/{id}/grade` | Teacher | Grade submission and assign feedback |

## Admin APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/analytics` | Admin | Get platform-wide activity metrics |
| GET | `/api/admin/users` | Admin | Get list of all registered users |
| POST | `/api/admin/teachers` | Admin | Create & approve Teacher account |
| PUT | `/api/admin/users/{id}/status` | Admin | Toggle user active/deactivated status |
| POST | `/api/admin/announcements` | Admin | Broadcast announcement |

## File Upload API
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/files/upload` | Authenticated | Upload PDF, Image, or Video file |
