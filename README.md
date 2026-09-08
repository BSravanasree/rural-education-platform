# A Web-Based Platform for Bridging the Rural Education Gap

A complete, production-grade digital education platform engineered specifically to support students, teachers, and administrators in rural and resource-constrained environments.

---

## 1. Executive Project Summary

### Problem Statement
Rural education faces severe systemic challenges:
- **Limited Access to Quality Teachers & Learning Resources**: Remote schools often lack specialized teachers and up-to-date physical textbooks.
- **Connectivity & Internet Constraints**: Low-bandwidth 2G/3G mobile networks cause standard heavy web applications to fail or buffer endlessly.
- **Language Barriers**: Native languages (such as Tamil, Telugu, Hindi) are essential for comprehension in rural villages.
- **Progress Tracking & Accountability**: Lack of centralized digital tracking for quiz scores, assignment submissions, and lesson completions.

### Solution Overview
This web platform bridges the gap by providing a low-bandwidth-friendly, multilingual digital learning management system featuring:
- **Student Module**: Public student registration, course browsing, PDF notes downloading, low-data video player (no autoplay), interactive quizzes with backend auto-scoring, and homework submissions.
- **Teacher Module**: Course creation, lesson management, PDF & video uploading, quiz builder with answer keys, and student submission grading with feedback.
- **Admin Module**: System user management (activate/deactivate), teacher creation/approval, platform analytics dashboard, and system-wide announcements.
- **Multilingual i18n Engine**: Seamless UI language switching between English, Tamil (தமிழ்), Telugu (తెలుగు), and Hindi (हिंदी).
- **Security Control Architecture**: Backend JWT role-based authorization enforcing strict STUDENT public registration, admin teacher approval, server-side quiz score evaluation, and server-calculated progress formulas.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js (Vite), React Router DOM, Axios, Lucide React Icons |
| **Styling** | Custom Responsive Vanilla CSS System (High-contrast, accessible) |
| **Multilingual i18n** | Custom i18n Translation Engine (EN, TA, TE, HI) |
| **Backend Framework** | Java 17, Spring Boot 3.2.3, Spring Web, Spring Data JPA |
| **Security & Auth** | Spring Security, Stateless JWT Authentication, BCrypt Password Encoder |
| **Database** | MySQL Relational Database |
| **Media & File Storage** | Cloudinary Cloud Storage Integration + Local Static Storage Fallback |
| **Build & Package Tools** | Apache Maven 3.9.6, Node.js / npm |

---

## 3. System Architecture

```
[ React.js Client ]
   ├── LanguageContext (EN / TA / TE / HI)
   ├── LowBandwidthContext (Data Saver Mode)
   └── AuthContext (JWT LocalStorage Handler)
            │
            ▼ REST APIs (JSON over HTTP)
[ Spring Boot Backend ]
   ├── Security Filter Chain (JwtAuthTokenFilter, JwtAuthEntryPoint)
   ├── Controllers Layer (Auth, Student, Teacher, Admin, Public, FileUpload)
   ├── Service Layer (AuthService, ProgressService, FileStorageService, DatabaseSeedService)
   └── JPA Repositories Layer
            │
            ├──► MySQL Database (`rural_edu_db`)
            └──► Cloudinary Storage / Local Uploads
```

---

## 4. Key Security & Architectural Directives

1. **Role Registration Enforcement**: Public registration (`POST /api/auth/register`) strictly assigns `ROLE_STUDENT`. Public users cannot select or request `ROLE_TEACHER` or `ROLE_ADMIN`.
2. **Teacher Account Approval**: Teacher accounts are created and approved exclusively by Administrators via `POST /api/admin/teachers`.
3. **Admin Account Security**: Admin accounts are initialized via secure seed configuration / environment variables and can never be publicly registered.
4. **Backend Quiz Evaluation**: Quiz scores are calculated strictly on the backend. The React frontend sends only student answer option selections (`{ questionId: "B" }`). The backend retrieves true answer keys, computes score percentages, logs a `QuizAttempt`, and updates progress.
5. **Backend Progress Calculation Formula**:
   $$\text{Course Progress (\%)} = \min\left(100, \frac{\text{Completed Lessons \& Videos} + \text{Completed Quizzes} + \text{Completed Assignments}}{\text{Total Activities in Course}} \times 100\right)$$
   Calculated dynamically on the database level.
6. **Low-Bandwidth Optimization**: Labeled as **"Low-Bandwidth Optimized"**. Disables video autoplay, supports low-res video streams, provides lightweight responsive pages, and compresses media payloads.
7. **File Validation**: Backend verifies MIME types (`application/pdf`, `image/jpeg`, `image/png`, `video/mp4`), file extensions, and size limits (max 50MB).

---

## 5. Folder Structure

```
Rural Education Platform/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/rural/edu/
│   │   ├── config/ (WebSecurityConfig, CorsConfig, WebMvcConfig)
│   │   ├── controller/ (AuthController, StudentController, TeacherController, AdminController, PublicController, FileUploadController)
│   │   ├── dto/ (LoginRequest, RegisterRequest, JwtResponse, ApiResponse)
│   │   ├── entity/ (User, Student, Teacher, Admin, Course, Lesson, Video, StudyMaterial, Quiz, Question, QuizAttempt, Assignment, Submission, StudentProgress, Enrollment)
│   │   ├── repository/ (UserRepository, CourseRepository, EnrollmentRepository, QuizAttemptRepository, etc.)
│   │   ├── security/ (JwtUtils, JwtAuthTokenFilter, JwtAuthEntryPoint, UserDetailsImpl)
│   │   └── service/ (AuthService, ProgressService, FileStorageService, DatabaseSeedService)
│   └── src/test/java/com/rural/edu/ (AuthServiceTest, QuizServiceTest, ProgressServiceTest)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── api/ (axiosClient.js)
│   │   ├── components/ (Navbar.jsx, CourseCard.jsx, ProgressBar.jsx, VideoPlayer.jsx, FileUploader.jsx)
│   │   ├── context/ (AuthContext.jsx, LanguageContext.jsx, LowBandwidthContext.jsx)
│   │   ├── i18n/ (en.json, ta.json, te.json, hi.json, index.js)
│   │   ├── pages/
│   │   │   ├── public/ (LandingPage.jsx, LoginPage.jsx, RegisterPage.jsx, CoursesCatalogPage.jsx)
│   │   │   ├── student/ (StudentDashboard.jsx, CoursePlayerPage.jsx)
│   │   │   ├── teacher/ (TeacherDashboard.jsx, CourseEditorPage.jsx)
│   │   │   └── admin/ (AdminDashboard.jsx)
│   │   ├── App.jsx
│   │   └── App.css
└── docs/ (ARCHITECTURE.md, DATABASE_SCHEMA.md, API_DOCUMENTATION.md)
```

---

## 6. Environment Variables Setup

Create a `.env` file or configure system environment variables based on `.env.example`:

```env
DATABASE_URL=jdbc:mysql://localhost:3306/rural_edu_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
JWT_SECRET=RuralEduPlatformSecretKeyForJWTTokenGeneration2026SecureKeyWithMinimum256BitsLength!
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 7. How to Run Locally

### Prerequisites
- JDK 17+ installed
- Node.js 18+ and npm installed
- MySQL Server running locally on port 3306

### Step 1: Start Backend (Spring Boot)
```bash
cd backend
# Using bundled Maven 3.9.6
.\tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
*Note: Upon startup, `DatabaseSeedService` will automatically seed default roles, admin, teacher, student, sample courses, quizzes, and assignments.*

### Step 2: Start Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 8. Demo Test Accounts

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Student** | `student@ruraledu.org` | `student123` | Student Dashboard, Enroll Courses, Watch Videos, Attempt Quizzes, Submit Assignments |
| **Teacher** | `teacher@ruraledu.org` | `teacher123` | Teacher Hub, Create Courses, Add Lessons/PDFs/Videos, Build Quizzes, Grade Submissions |
| **Admin** | `admin@ruraledu.org` | `admin123` | Admin Console, Register Teachers, Deactivate/Activate Users, Analytics, Broadcasts |

---

## 9. Automated Testing Results

- **Backend Unit Tests**:
  - `AuthServiceTest`: Passed (Verifies STUDENT-only public registration enforcement).
  - `QuizServiceTest`: Passed (Verifies backend score evaluation).
  - `ProgressServiceTest`: Passed (Verifies dynamic progress percentage formula).
  - Test Suite Summary: `Tests run: 3, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS`).
- **Frontend Production Build**:
  - Vite Bundle Compilation: `✓ built in 4.78s` (`dist/index.html`, `dist/assets/index.js`, zero JSX or lint errors).
