# AIBoost Frontend

This is the frontend application for the AIBoost learning platform, built with React and using various modern web technologies.

AIBoost is a comprehensive online learning platform focused on AI and productivity enhancement. This project consists of a React-based frontend and an Express.js backend, providing a full-featured educational experience.

## Technologies Used

- React
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Lucide React for icons
- React Markdown for rendering course content
- React Syntax Highlighter for code blocks

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variable:
   ```
   REACT_APP_API_URL=http://localhost:5345
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will start on `http://localhost:3000`.

## Project Structure

- `src/components/`: React components
- `src/contexts/`: React context providers
- `src/services/`: API service functions
- `src/assets/`: Static assets like images

## Key Components

- `App.jsx`: Main component with routing logic
- `LandingPage.jsx`: Home page with course listings
- `ProfilePage.jsx`: User dashboard with enrolled courses
- `ChapterContent.jsx`: Displays course chapter content
- `CoursePresentation.jsx`: Shows course details and chapters
- `Login.jsx` and `InscriptionFormModal.jsx`: Handle user authentication
- `AdminDashboard.jsx` and `MentorDashboard.jsx`: Admin and mentor interfaces

## State Management

The application uses React's Context API for global state management, particularly for user authentication (`AuthContext.jsx`).

## Styling

Tailwind CSS is used for styling. Custom styles are defined in `src/index.css`.

## API Integration

The `api.js` file in the `services` directory contains all the API calls using Axios. It includes interceptors for adding authentication tokens and handling errors.

## Responsive Design

The application is designed to be responsive, with different layouts for mobile and desktop views.

## Building for Production

To create a production build, run:

```
npm run build
```

This will create a `build` directory with optimized production files.

## Contributing

Please read the main README for contribution guidelines.