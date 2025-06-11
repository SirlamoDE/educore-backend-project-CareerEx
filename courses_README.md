# Courses Module

This module handles the creation, retrieval, and management of courses on the EduCore platform.

## Responsibilities

- Instructor course creation with validation
- Unique slug generation for SEO-friendly URLs
- Get all courses or filter by instructor name
- Get course details including instructor info and enrollment count

## Files

- `course.controller.js`: Request handling for course actions
- `course.routes.js`: Defines routes like `/courses`, `/courses/:slug`
- `course.service.js`: Core business logic
- `course.model.js`: Course schema definition with Mongoose
