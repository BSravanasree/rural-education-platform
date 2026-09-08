# System Architecture — Rural Education Platform

## Overview
The platform follows a standard full-stack multi-tier layered architecture optimized for low-bandwidth environments:

```
[ React.js Frontend (Vite) ]
  ├── i18n Internationalization (EN, TA, TE, HI)
  ├── Low-Bandwidth Mode Controller (No Auto-Play, Compressed Media)
  └── Axios Interceptor (JWT Bearer Token)
           │
           ▼ REST API (JSON)
[ Spring Boot Backend ]
  ├── Web Security Config (Stateless JWT Filter, BCrypt Password Encoder)
  ├── Controllers Layer (Auth, Student, Teacher, Admin, Public, FileUpload)
  ├── Service Layer (AuthService, ProgressService, FileStorageService, SeedService)
  └── JPA Repository Layer (Spring Data JPA)
           │
           ├──► [ MySQL Relational Database ]
           └──► [ Cloud Storage / Cloudinary Media Service ]
```

## Security Rules Architecture
1. **Public Registration Restriction**: `POST /api/auth/register` creates `ROLE_STUDENT` accounts strictly.
2. **Teacher Account Authorization**: Teachers can only be created by Administrators via `POST /api/admin/teachers`.
3. **Admin Account Security**: Admin accounts are initialized via secure seed configuration or environment variables; public registration of admin accounts is strictly disabled.
4. **Backend Score Calculation**: Quiz scores are computed on the backend by matching submitted answer option keys against stored answer keys.
5. **Backend Progress Engine**: Progress = `(Completed Activities / Total Activities) * 100` calculated strictly on the backend database level.
6. **Teacher Course Ownership**: Teachers are authorized only to edit their own courses and grade submissions for their own courses.
