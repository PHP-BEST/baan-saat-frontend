# Development Guide

This guide outlines how to set up, develop, test, and maintain the `baan-saat-frontend` project.

## Table of Contents

- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Deployment](#deployment)
- [Workflow & Branching](#workflow--branching)

---

## Installation

1. **Clone this repository:**

   ```bash
   git clone https://github.com/PHP-BEST/baan-saat-frontend.git
   cd baan-saat-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Environment Setup

- Create a `.env` file in the root directory with the variables in [.env.example](/.env.example)

## Running the Application

- **Start the development server:**
  ```bash
  npm run dev
  ```
- By default, the app runs on `localhost:5173`.

### Environment Modes

- **`development`** (default): Uses `VITE_API_ROOT_DEV` - connects to development backend on Vercel
- **`production`**: Uses `VITE_API_ROOT_PROD` - connects to production backend on Vercel
- **`test`**: Uses `VITE_API_ROOT_LOCAL` - connects to local backend (for testing unreleased backend changes)

So... No need to use `production` but if you changes something in the backend, I recommend using `test` mode to check the result immediately

## Project Structure

```
src/
  api/          # API service functions and type definitions
  assets/       # Static assets (images, icons, etc.)
  components/   # React components
    our-components/  # Custom application components
    ui/         # Reusable UI components (shadcn/ui)
  config/       # Configuration files (API, environment)
  hooks/        # Custom React hooks
  lib/          # Utility functions and helpers
  pages/        # Page components for routing
  tests/        # Jest and React Testing Library tests
  App.tsx       # Main App component with routing
  main.tsx      # Application entry point
  index.css     # Global styles and Tailwind imports
  ...
```

### File Index and Naming Conventions

#### `/src/api/` - API Services

**Purpose**: API service functions, request/response handlers, and TypeScript type definitions
**Naming Convention**: `<resource-name>.ts`

- `samples.ts` - Sample API service with getSamples(), getSampleById() functions and Sample interface

#### `/src/assets/` - Static Assets

**Purpose**: Images, icons, SVGs, and other static files
**Naming Convention**: `<asset-name>.<extension>`

- `react.svg` - React logo SVG

#### `/src/components/` - React Components

**Purpose**: Reusable React components organized by category
**Naming Convention**: `<ComponentName>.tsx` (PascalCase)

##### `/src/components/our-components/` - Custom Components

- `counter.tsx` - Counter component with input and increment functionality

##### `/src/components/ui/` - UI Components (shadcn/ui)

- `button.tsx` - Button component with variants and size options
- `input.tsx` - Input component with styling and focus states

#### `/src/config/` - Configuration Files

**Purpose**: Environment configuration, API setup, and app-wide settings
**Naming Convention**: `<config-type>.ts`

- `api.ts` - API configuration with apiFetch utility and API_ROOT selection logic
- `env.ts` - Environment variables exports and type safety

#### `/src/hooks/` - Custom React Hooks

**Purpose**: Reusable stateful logic and side effects
**Naming Convention**: `use<HookName>.ts`

- `useCounter.ts` - Counter hook with count state and increment functionality

#### `/src/lib/` - Utility Functions

**Purpose**: Helper functions, utilities, and shared logic
**Naming Convention**: `<utility-name>.ts`

- `utils.ts` - Utility functions including cn() for className merging

#### `/src/pages/` - Page Components

**Purpose**: Top-level page components for routing
**Naming Convention**: `<PageName>Page.tsx`

- `LandingPage.tsx` - Landing page with counter, API samples display, and navigation
- `RegisterPage.tsx` - Registration page component
- `ErrorPage.tsx` - Error page with navigation back to landing

#### `/src/tests/` - Test Files

**Purpose**: Jest and React Testing Library unit and integration tests
**Naming Convention**: `<component-name>.test.ts` or `<hook-name>.test.ts`

- `useCounter.test.ts` - Comprehensive tests for useCounter hook functionality

#### Root Files

- `App.tsx` - Main application component with React Router setup
- `main.tsx` - Application entry point with React root rendering
- `index.css` - Global styles, Tailwind CSS imports, and CSS custom properties
- `vite-env.d.ts` - Vite environment type definitions

🚧🚧 **Under Construction** 🚧🚧

## Code Quality

- **Linting:**
  ```bash
  npm run lint
  ```
- **Formatting:**
  ```bash
  npm run format
  ```

## Testing

- **Run tests:**
  ```bash
  npm test
  ```
- Test files are located in `src/tests/`.

## Deployment

The frontend is deployed on Vercel with two environments:

- **Development**: https://baan-saat-frontend-dev.vercel.app/
  - Automatically deploys from the `developer` branch
  - Used for testing and staging
  - Connected to development database and services

- **Production**: https://baan-saat-frontend.vercel.app/
  - Automatically deploys from the `main` branch
  - Live production environment
  - Connected to production database and services

### Deployment Workflow

1. Push changes to `developer` branch → Development environment updates automatically
2. Merge `developer` to `main` branch → Production environment updates automatically

## Workflow & Branching

1. **Create a New Branch**
   - Always create a new branch from the latest `developer` branch before starting work.
   - Use a descriptive branch naming convention based on your task type:
     - For new features: `feat/<feature-name>`
     - For bug fixes: `fix/<short-description>`
     - For documentation: `docs/<short-description>`
     - For refactoring: `refactor/<short-description>`
     - For chores/maintenance: `chore/<short-description>`
     - For UI/styling: `ui/<short-description>`
   - Example:
     ```bash
     git checkout developer
     git pull
     git checkout -b feat/user-dashboard
     ```

2. **Commit and Push Changes**
   - Write clear and concise commit messages.
   - Use the following commit message convention:
     - For new features: `feat: <feature-name>`
     - For bug fixes: `fix: <short-description>`
     - For documentation: `docs: <short-description>`
     - For refactoring: `refactor: <short-description>`
     - For chores/maintenance: `chore: <short-description>`
     - For UI/styling: `ui: <short-description>`
   - Example:
     ```bash
     git add .
     git commit -m "feat: add user authentication form"
     git push origin feat/user-dashboard
     ```

3. **Open a Pull Request**
   - **On GitHub**, open a pull request from your feature/fix branch to the `developer` branch (never directly into `main`).
   - Assign reviewers if required.
   - Wait for approval and merge.
   - After merging, **delete your working branch** and recreate it from the updated `developer` branch for your next task:
     ```bash
     git checkout developer
     git pull
     git branch -d feat/user-dashboard
     git checkout -b feat/another-feature
     ```

4. **Never Commit Directly to `main` or `developer`**
   - All changes must be made through pull requests from a feature/fix branch.

### Testing Backend Integration

When working with unreleased backend changes:

1. **Run backend locally** on `localhost:5000`
2. **Test your frontend** changes against the local backend

Note: If it works, don't forget to push that backend code also...

---

**Before starting any new work or continuing your work, always pull and merge the latest changes from the `developer` branch into your feature branch:**

```bash
git checkout developer
git pull
git checkout <your-feature-branch>
git merge developer
```

---
