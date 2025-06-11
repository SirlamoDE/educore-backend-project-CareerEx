# Enrollments Module

Handles student enrollment into courses and tracks completion status.

## Responsibilities

- Students can enroll into available courses
- Instructors can view students enrolled in their courses
- Students can view enrolled courses with completion status
- Students can update course completion status

## Files

- `enrollment.controller.js`: Handles enrollment actions
- `enrollment.routes.js`: Endpoints like `/enroll`, `/my-courses`
- `enrollment.service.js`: Handles business logic for enrollment
- `enrollment.model.js`: Defines enrollment schema (student, course, completed)
