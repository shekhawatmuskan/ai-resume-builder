# GitHub Copilot Instructions for ai-resume-builder

## Project Overview
- This is a React + Vite project for building an AI-powered resume builder.
- Main UI code is in `src/`, with feature modules under `Dashboard`, `auth`, and `components`.
- Service logic (API calls, modals) is in `service/`.
- UI primitives (Button, Input, Dialog, etc.) are in `src/components/ui/`.
- Resume editing and preview logic is in `src/Dashboard/resume/components/`.

## Build & Run
- Use `npm install` to install dependencies.
- Use `npm run dev` for local development (Vite dev server).
- Use `npm run build` to build for production.

## Key Patterns & Conventions
- All UI forms use controlled components with local state (see `Skills.jsx`, `PersonalDetail.jsx`).
- Data flows via React context (`src/context/ResumeInfoContext.jsx`) for resume info sharing.
- API calls are abstracted in `service/GlobalApi.js`.
- Modals are managed via `service/AIModal.js`.
- Dynamic routing for resume editing: `src/Dashboard/resume/[resumeID]/edit/index.jsx`.
- Preview components are separated from form components (e.g., `SkillsPreview.jsx` vs `Skills.jsx`).
- Tailwind CSS is used for styling; config in `tailwind.config.js`.
- ESLint and PostCSS are configured for code quality and CSS processing.

## External Dependencies
- Uses `@smastrom/react-rating` for skill ratings.
- Uses Vite plugins for React and HMR.

## Example Workflow
- To add a new resume section, create a form in `src/Dashboard/resume/components/forms/` and a preview in `src/Dashboard/resume/components/preview/`.
- Update context in `ResumeInfoContext.jsx` to include new section data.
- Use UI primitives from `src/components/ui/` for consistency.

## Tips for AI Agents
- Always use context and service abstractions for data and API logic.
- Follow the controlled component pattern for forms.
- Reference existing form/preview pairs for new features.
- Use Tailwind utility classes for styling.

---
If any section is unclear or missing, please provide feedback to improve these instructions.
