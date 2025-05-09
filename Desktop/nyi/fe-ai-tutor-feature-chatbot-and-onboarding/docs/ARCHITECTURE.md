# AI Tutor Frontend - Architecture Documentation

This document provides a visual representation of the AI Tutor Frontend architecture, component relationships, and data flow.

## Application Architecture

```
                                  +-------------------+
                                  |                   |
                                  |   App.jsx         |
                                  |                   |
                                  +-------------------+
                                           |
                                           |
                                           v
                       +-------------------------------------------+
                       |                                           |
                       |              RouterProvider               |
                       |                                           |
                       +-------------------------------------------+
                                           |
                           +---------------+---------------+
                           |               |               |
                           v               v               v
            +------------------+  +----------------+  +----------------+
            |                  |  |                |  |                |
            |  PublicLayout    |  |  AuthLayout    |  |  MainLayout    |
            |                  |  |                |  |                |
            +------------------+  +----------------+  +----------------+
                    |                     |                   |
                    v                     v                   v
            +------------------+  +----------------+  +----------------+
            | Landing Pages    |  | Auth Pages     |  | App Pages      |
            | - Home           |  | - Login        |  | - Dashboard    |
            | - Features       |  | - Register     |  | - Exams        |
            | - Pricing        |  | - Verify       |  | - Profile      |
            | - About          |  | - Reset        |  | - Quiz         |
            | - Contact        |  |                |  | - Results      |
            +------------------+  +----------------+  +----------------+
```

## State Management Architecture

```
                            +-------------------+
                            |                   |
                            |    Redux Store    |
                            |                   |
                            +-------------------+
                                     |
                  +------------------+-------------------+
                  |                  |                   |
                  v                  v                   v
        +------------------+ +----------------+ +------------------+
        |                  | |                | |                  |
        |   Auth Slice     | |   Toast Slice  | |   API Slice      |
        |                  | |                | |                  |
        +------------------+ +----------------+ +------------------+
                  |                  |                   |
                  v                  v                   v
        +------------------+ +----------------+ +------------------+
        | - isAuthenticated| | - notifications| | - API endpoints  |
        | - user data      | | - alerts       | | - data caching   |
        | - auth status    | |                | | - request state  |
        +------------------+ +----------------+ +------------------+
```

## Component Hierarchy

```
App
├── ThemeContextProvider
│   └── GoogleOAuthProvider
│       └── RouterProvider
│           ├── PublicLayout
│           │   ├── Header
│           │   ├── Page Content (LandingPage, Features, etc.)
│           │   └── Footer
│           │
│           ├── AuthLayout
│           │   ├── Logo
│           │   └── Auth Forms (Login, Register, etc.)
│           │
│           └── MainLayout
│               ├── Header
│               │   ├── Logo
│               │   ├── Navigation
│               │   └── UserProfileComponent
│               │
│               ├── Page Content
│               │   ├── Dashboard
│               │   ├── Exams
│               │   ├── Quiz
│               │   └── Results
│               │
│               ├── BreadCrumbs
│               ├── Footer
│               └── BottomNavBar (mobile)
```

## Data Flow

```
+-------------+     +-------------+     +-------------+
|             |     |             |     |             |
| User Action |---->| Component   |---->| Dispatch    |
|             |     | Event       |     | Action      |
+-------------+     +-------------+     +-------------+
                                              |
                                              v
+-------------+     +-------------+     +-------------+
|             |     |             |     |             |
| Component   |<----| State       |<----| Reducer     |
| Re-render   |     | Update      |     | Function    |
|             |     |             |     |             |
+-------------+     +-------------+     +-------------+
```

## Authentication Flow

```
+-----------+     +------------+     +-------------+     +-----------+
|           |     |            |     |             |     |           |
| Login Form|---->| Submit     |---->| API Request |---->| Backend   |
|           |     | Credentials|     | (RTK Query) |     | API       |
+-----------+     +------------+     +-------------+     +-----------+
                                          |
                                          v
+-----------+     +------------+     +-------------+
|           |     |            |     |             |
| Protected |<----| Update     |<----| Store Token |
| Routes    |     | Auth State |     | in Storage  |
|           |     |            |     |             |
+-----------+     +------------+     +-------------+
```

## Quiz Flow

```
+------------+     +------------+     +------------+     +------------+
|            |     |            |     |            |     |            |
| Quiz       |---->| Question   |---->| User       |---->| Answer     |
| Initialize |     | Display    |     | Input      |     | Submission |
|            |     |            |     |            |     |            |
+------------+     +------------+     +------------+     +------------+
                                                              |
                                                              v
+------------+     +------------+     +------------+     +------------+
|            |     |            |     |            |     |            |
| Analysis   |<----| Score      |<----| Evaluate   |<----| Process    |
| Display    |     | Calculation|     | Answers    |     | Submission |
|            |     |            |     |            |     |            |
+------------+     +------------+     +------------+     +------------+
```

## API Integration

```
+----------------+                               +----------------+
|                |                               |                |
| Frontend       |                               | Backend        |
| Components     |                               | API            |
|                |                               |                |
+----------------+                               +----------------+
        |                                                |
        |  +------------------------------------------+  |
        |  |                                          |  |
        +->|  RTK Query Service                       |<-+
           |  - Authentication                        |
           |  - User Management                       |
           |  - Exam Management                       |
           |  - Quiz & Assessment                     |
           |                                          |
           +------------------------------------------+
                               |
                               v
                     +------------------+
                     |                  |
                     | Redux Store      |
                     |                  |
                     +------------------+
```

## Folder Structure Details

```
src/
├── assets/                # Static assets
│   ├── images/            # Image files
│   └── icons/             # Icon files
│
├── components/            # Reusable UI components
│   ├── Toasts/            # Toast notification components
│   ├── Header.jsx         # Application header
│   ├── Footer.jsx         # Application footer
│   ├── Logo.jsx           # Logo component
│   ├── BreadCrumbs.jsx    # Breadcrumb navigation
│   └── BottomNavBar.tsx   # Mobile bottom navigation
│
├── layouts/               # Page layouts
│   ├── AuthLayout.jsx     # Layout for authentication pages
│   ├── MainLayout.jsx     # Main application layout
│   └── PublicLayout.jsx   # Layout for public pages
│
├── pages/                 # Page components
│   ├── login/             # Login-related pages
│   ├── home/              # Home page
│   ├── Quiz/              # Quiz-related pages
│   ├── Details/           # Detail pages
│   ├── Onboarding/        # Onboarding process
│   ├── Dashboard/         # User dashboard
│   ├── landing/           # Landing page and marketing
│   └── profile/           # User profile pages
│
├── routes/                # Routing configuration
│   ├── index.jsx          # Main router configuration
│   ├── OnboardingGuard.jsx# Onboarding route guard
│   └── QuizGuard.jsx      # Quiz route guard
│
├── store/                 # Redux store
│   ├── index.js           # Store configuration
│   └── slices/            # Redux slices
│       ├── apiServices.js # RTK Query services
│       ├── auth.js        # Authentication slice
│       └── toasts.js      # Toast notifications slice
│
├── theme/                 # Theming configuration
│   └── ThemeContext.jsx   # Theme context provider
│
├── utils/                 # Utility functions
│   ├── api.js             # API utilities
│   ├── auth.js            # Authentication utilities
│   ├── formatting.js      # Data formatting
│   └── validation.js      # Form validation
│
├── App.jsx                # Main application component
└── main.jsx               # Entry point
```

## Feature Integration

```
+-------------------+     +------------------+     +------------------+
|                   |     |                  |     |                  |
| Authentication    |---->| User Onboarding  |---->| Main Application |
| - Login           |     | - Welcome        |     | - Dashboard      |
| - Register        |     | - Preferences    |     | - Exams          |
| - Verification    |     | - Tour           |     | - Quizzes        |
|                   |     |                  |     |                  |
+-------------------+     +------------------+     +------------------+
```

## User Journey Flow

```
Start
  │
  ├─── Public Pages (Marketing Site)
  │      │
  │      └─── Login/Register
  │                │
  │                v
  ├─── Verification (if needed)
  │      │
  │      v
  ├─── Invite Code (if needed)
  │      │
  │      v
  ├─── Onboarding
  │      │
  │      v
  ├─── Dashboard
  │      │
  │      ├─── Browse Exams
  │      │      │
  │      │      └─── Select Exam
  │      │               │
  │      │               v
  │      ├─── Take Quiz
  │      │      │
  │      │      └─── View Results
  │      │
  │      └─── View Profile/Progress
  │
End
```

This architecture documentation provides a visual representation of the AI Tutor Frontend system, helping developers understand the component relationships, data flow, and overall structure. 