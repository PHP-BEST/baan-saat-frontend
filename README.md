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
   npm install husky --save-dev
   npx husky
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
   - Wait for approval and merge (You can merge by yourself if it's approved).
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
