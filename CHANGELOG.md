# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.29] - 2025-09-27

### Changed

- Added bottom padding (`pb-24`) to the main container of all sub-pages (About, Projects, Resume) to create a consistent buffer at the bottom of the screen and improve usability on mobile devices.
- Shortened the biography on the About page to be more concise, focusing on the key highlights of education, experience, and interests.
- Updated and reordered the Technical Skills list on the About page, adding C++ and prioritizing programming languages.

## [0.1.27] - 2025-09-27

### Fixed

- Resolved an issue where the PDF resume would not display on any iPad model. The device detection logic was simplified and made more robust by checking for general touch support (`'ontouchstart' in window`) instead of relying on unreliable user agent or platform strings. This ensures all touch-capable devices, including all iPads and touch-screen laptops, are correctly served the functional gesture-based PDF viewer.

## [0.1.26] - 2025-09-27

### Changed

- Fundamentally refactored the mobile `PdfViewer` component to resolve issues with setting the initial scale. The component now uses a standard React `useState` for scale management, which is passed directly to the `<Page>` component. Panning remains controlled by `react-spring`. This separation of concerns provides a more direct and reliable control over the PDF's scale.

## [0.1.25] - 2025-09-27

### Changed

- Refactored the resume page to use different PDF rendering strategies for desktop and mobile. Desktop users now get a native browser PDF viewer via an `<iframe>` for a full-featured experience. Mobile users get a simplified, gesture-based viewer (`react-pdf` with `use-gesture`) without the slider controls, relying purely on pinch-to-zoom and pan.
- The mobile PDF viewer now dynamically calculates the initial zoom level to fit the PDF to the container's width, providing a better default viewing experience. The scaling factor was adjusted to provide more horizontal padding.

## [0.1.24] - 2025-09-27

### Fixed

- Fixed a persistent issue where the PDF viewer's zoom slider would fight user input and snap back to its original position. The root cause was a race condition between the slider's input event and the animation's feedback loop. The final solution uses a `useRef` flag (`isSliding`) to prevent the animation from updating the slider's UI while the user is actively dragging it, giving the user full control and resolving the conflict.

## [0.1.23] - 2025-09-27

### Changed

- Refactored the PDF viewer on the resume page to use `@use-gesture/react` and `@react-spring/web` for handling pinch-to-zoom and panning gestures. This provides a much smoother and more responsive user experience on mobile devices, resolving issues with laggy zooming and restricted panning.

### Fixed

- Fixed an issue in the PDF viewer where the zoom slider would not correctly stay at the selected magnification level. The slider now accurately reflects and controls the current zoom state by binding it directly to the animation state.

## [0.1.21] - 2025-09-27

### Fixed

- Removed unused `zoomIn` and `zoomOut` functions from `src/components/PdfViewer.tsx` to eliminate build warnings.

## [0.1.20] - 2025-09-27

### Changed

- Adjusted the initial zoom level of the resume page to 60% on mobile devices.

## [0.1.19] - 2025-09-27

### Changed

- Replaced the zoom in/out buttons in `src/components/PdfViewer.tsx` with an HTML range input for more intuitive scaling control.

## [0.1.18] - 2025-09-27

### Fixed

- Resolved build errors by escaping an apostrophe in `src/app/about/page.tsx` to fix `react/no-unescaped-entities` error.
- Removed unused `useState` import from `src/components/ThreeScene.tsx` to address lint warnings.
- Fixed remote deploy errors and lint warnings.

## [0.1.17] - 2025-09-26

### Changed

- Replaced `react-zoom-pan-pinch` with native touch event handling for pinch-to-zoom and drag-to-pan functionality in the PDF viewer. This provides a more direct and customizable control over mobile gestures.

## [0.1.16] - 2025-09-26

### Fixed

- Resolved the PDF centering issue in the resume viewer by correctly configuring the parent container as a flex container and ensuring the `TransformWrapper` fills the available space. This ensures the PDF content is always centered within its viewport.

## [0.1.15] - 2025-09-26

### Changed

- The PDF viewer on the resume page now automatically sets the initial zoom level to fit the width of the container. This provides a better default viewing experience on all devices.

## [0.1.14] - 2025-09-26

### Changed

- Replaced `@use-gesture/react` with `react-zoom-pan-pinch` for handling pinch-to-zoom and panning gestures in the PDF viewer. This change was made to improve the user experience on mobile devices, providing a more natural and intuitive interaction.

## [0.1.13] - 2025-09-26

### Added

- Implemented pinch-to-zoom and drag-to-pan functionality for the PDF viewer on the resume page. This was achieved by integrating the `@use-gesture/react` library to handle touch gestures on mobile devices, significantly improving the user experience.

## [0.1.12] - 2025-09-26

### Fixed

- Resolved a "DOMMatrix is not defined" server-side rendering error on the resume page by dynamically importing the `PdfViewer` component with SSR disabled.
- Fixed the "Failed to load PDF file" error by self-hosting the `pdf.js` worker (`pdf.worker.min.mjs`) and updating the `PdfViewer` component to use the local copy instead of a CDN.

## [0.1.11] - 2025-09-26

### Fixed

- Removed unnecessary CSS imports for `react-pdf`'s `AnnotationLayer` and `TextLayer` in `PdfViewer.tsx`. These imports were causing a build failure as the corresponding features were disabled and the file paths were incorrect in the installed version of the library.

## [0.1.10] - 2025-09-26

### Changed

- Replaced the `iframe` based PDF viewer on the resume page with a custom `PdfViewer` component using `react-pdf`. This provides a more consistent and interactive user experience across all devices.

## [0.1.9] - 2025-09-26

### Reverted

- Reverted the resume page implementation from `react-pdf` back to a native `iframe` embed. The `react-pdf` approach, while compatible, sacrificed the desired interactive viewer experience. The site now uses the browser's native PDF viewer on desktop and a download fallback on mobile.

## [0.1.8] - 2025-09-26

### Fixed

- Resolved all PDF rendering issues on the resume page by self-hosting the `pdf.js` worker file, removing reliance on external CDNs.
- Corrected Next.js component architecture by moving the dynamic import with `ssr: false` into its own dedicated client component (`ResumePageClient`) to prevent server-side rendering errors.

## [0.1.7] - 2025-09-26

### Fixed

- Disabled server-side rendering (SSR) for the `ResumeViewer` component using dynamic import to prevent browser-only APIs from being called in a Node.js environment.

## [0.1.6] - 2025-09-26

### Fixed

- Refactored the resume page by separating the server-side `metadata` export from the client-side PDF viewer logic, resolving the Next.js build error.

## [0.1.5] - 2025-09-26

### Changed

- Replaced the PDF embedding on the resume page with `react-pdf` to render the PDF as images, enabling cross-device visibility (including mobile).
- Added loading and error states to the resume viewer for better UX.

## [0.1.4] - 2025-09-26

### Fixed

- The embedded PDF on the resume page is now hidden on mobile devices, showing a fallback message instead to improve user experience on unsupported devices.

## [0.1.3] - 2025-09-26

### Changed

- Reordered the main navigation links to `Home, About, Resume, Projects`.

## [0.1.2] - 2025-09-26

### Added

- Created a new `/resume` page to display the user's PDF resume.
- Designed a themed "document viewer" to embed the PDF without clashing with the dark theme.
- Added a "Download PDF" button to the resume page.
- Added a "Resume" link to the main navigation header.

## [0.1.1] - 2025-09-26

### Changed

- Updated the subtitle on the homepage to "Crafting intelligent and scalable distributed systems."