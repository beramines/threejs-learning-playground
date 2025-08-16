# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server on http://localhost:5173
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm test:e2e` - Run Playwright end-to-end tests
- `npm test:e2e:ui` - Run Playwright tests with UI mode
- `npm test:e2e:headed` - Run Playwright tests in headed mode
- `npm test:e2e:debug` - Debug Playwright tests
- `npm test:e2e:report` - Show Playwright test report

## Project Architecture

This is a Three.js learning playground built with React, TypeScript, and modern 3D libraries. The application is structured as an interactive educational platform with 12 categories of 3D samples.

### Core Structure

- **React Router-based SPA**: Single-page application with client-side routing
- **Component Architecture**: Modular React components with TypeScript
- **Sample-based Learning**: Each category contains multiple interactive samples
- **Real-time Controls**: Leva GUI controls for interactive parameter adjustment

### Key Architectural Patterns

1. **Category-Sample Hierarchy**: 12 categories (basics, geometries, materials, etc.) each containing multiple samples
2. **Dynamic Component Loading**: Samples are dynamically imported and rendered based on URL routing
3. **Shared Layout System**: Header/Sidebar layout with responsive design
4. **Centralized Sample Registry**: All samples registered through `samplesMap` in App.tsx

### Sample Component Convention

Each sample follows this pattern:
```tsx
export default function SampleName() {
  const { param } = useControls('Settings', {
    param: { value: 1, min: 0, max: 10 }
  });
  
  return <Canvas>{/* 3D Scene */}</Canvas>;
}

SampleName.title = 'Display Title';
SampleName.description = 'Sample description';
```

### Technology Stack Integration

- **React Three Fiber**: Declarative 3D scene construction
- **React Three Drei**: Helper components and utilities
- **React Three Cannon**: Physics simulation (cannon-es)
- **React Three Postprocessing**: Visual effects and filters
- **Leva**: Real-time GUI controls for parameters
- **Tailwind CSS**: Utility-first styling

### File Organization

- `src/samples/[category]/` - Category-specific sample components
- `src/components/layout/` - Header, Sidebar layout components  
- `src/components/` - Core application components (CategoryView, SampleViewer, etc.)
- `src/types/index.ts` - Type definitions and category metadata
- `e2e/` - Playwright end-to-end tests

### Development Notes

- All samples use React Three Fiber's `<Canvas>` component as the root 3D container
- Leva controls should be used for interactive parameters to enhance learning
- Each category exports samples through its `index.ts` file
- TypeScript strict mode is enabled - maintain type safety
- The app supports both Japanese and English (primarily Japanese in UI)

### Testing Strategy

Comprehensive Playwright E2E tests cover:
- Navigation between categories and samples
- 3D content rendering and canvas interaction
- Leva controls functionality
- Performance and memory leak detection
- Responsive layout behavior