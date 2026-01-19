# Component Forge - JamJam Delivery App

## Overview
A React + TypeScript frontend application for a delivery booking service called "JamJam". Built with Vite, Tailwind CSS, and various UI libraries.

## Project Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 with tailwindcss-animate
- **UI Libraries**: 
  - Radix UI components
  - Lucide React icons
  - Framer Motion for animations
  - React Three Fiber for 3D elements
  - Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Drag & Drop**: dnd-kit

### Directory Structure
```
src/
├── App.tsx          # Main application component
├── main.tsx         # Entry point
├── index.css        # Global styles
├── components/      # React components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── settings/        # App settings/configuration
```

### Development
- Dev server runs on port 5000
- Uses `npm run dev` for development
- Uses `npm run build` for production build (outputs to `dist/`)

## Recent Changes
- January 2026: Initial import and Replit environment setup
  - Configured Vite to bind to 0.0.0.0:5000 with allowedHosts
  - Set up workflow for development server
  - Configured static deployment
