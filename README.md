# Hamlet - Civic Social Platform

Hamlet is a single-page civic social platform designed to surface verified candidate content by governorate for Iraq’s 2025 national election. It supports various content formats (posts, reels, events, debates), integrates social media features, and is designed to be fully accessible and bilingual (English, Arabic, Sorani Kurdish).

## Project Structure

The application is a modern, single-page application built with React and TypeScript, styled with Tailwind CSS. It operates without a traditional build tool like Vite or Create React App, using ES modules directly in the browser via an `importmap`.

```
/
├── components/
│   ├── icons/
│   │   └── Icons.tsx         # SVG icons as React components
│   ├── views/
│   │   ├── compose/
│   │   │   ├── EventComposer.tsx # UI for creating events
│   │   │   └── ReelComposer.tsx  # UI for creating reels
│   │   ├── CandidatesView.tsx  # View for listing candidates
│   │   ├── CandidateProfileView.tsx # Detailed view for a single candidate
│   │   ├── ComposeView.tsx     # Main post composer UI
│   │   ├── DebatesView.tsx     # View for listing debates
│   │   ├── ...and other views...
│   ├── BottomBar.tsx         # Mobile navigation
│   ├── CandidatePill.tsx     # Compact candidate display component
│   ├── Header.tsx            # Main application header
│   ├── HeroSection.tsx       # Image carousel on the home page
│   ├── LanguageSwitcher.tsx  # UI for changing language
│   ├── LoginModal.tsx        # Login/Registration modal
│   ├── PostCard.tsx          # Component for displaying a single post
│   ├── Sidebar.tsx           # Desktop sidebar navigation
│   ├── Stories.tsx           # Horizontal stories component
│   └── TopNavBar.tsx         # Reusable tab navigation
├── services/
│   └── geminiService.ts      # Service for interacting with the Google Gemini API
├── App.tsx                   # Main application component, manages state and views
├── constants.ts              # Mock data for users, posts, etc.
├── index.html                # The single HTML entry point
├── index.tsx                 # Renders the React application
├── translations.ts           # Contains all UI text for EN, KU, AR
└── types.ts                  # TypeScript type definitions
```

## Key Files & Features

-   **`App.tsx`**: The core of the application. It manages all major state, including the current user, active view, selected language, and modal visibility. This is the central hub for application logic.
-   **`components/views/HomeView.tsx`**: The main dashboard that users see. It aggregates multiple components like the `HeroSection`, `Stories`, and the main content feed, which is tabbed to show Posts, Reels, Events, etc.
-   **`constants.ts`**: Currently, all data is mocked and stored here. This file is the primary target for replacement when integrating a backend.
-   **`translations.ts`**: A simple but effective internationalization (i18n) solution. All display text is pulled from this file based on the selected language.
-   **Guest Mode & Login Flow**: The app starts in a "guest" mode where content is viewable. Interactions (liking, commenting, viewing reels) are intercepted by the `requestLogin` function, which opens the `LoginModal` to encourage sign-ups.

## Next Steps: Integrating a Backend

This foundational code is designed for easy integration with a real backend API. Here are the recommended steps:

1.  **Replace Mock Data with API Calls:**
    -   In components like `HomeView.tsx`, `CandidatesView.tsx`, etc., replace direct imports from `constants.ts` with `useEffect` hooks that fetch data from your API.
    -   Create a dedicated `apiService.ts` file to centralize `fetch` or `axios` logic for endpoints like `/posts`, `/users`, `/events`, etc.
    -   Example: In `HomeView.tsx`, instead of `const socialPosts = MOCK_POSTS.filter(...)`, you would have:
        ```typescript
        const [posts, setPosts] = useState<Post[]>([]);
        useEffect(() => {
          // apiService.getPosts(selectedGovernorate).then(setPosts);
        }, [selectedGovernorate]);
        ```

2.  **Implement Real Authentication:**
    -   In `LoginModal.tsx`, modify `handleSelectRole` to call your API's `/login` or `/register` endpoint.
    -   Upon successful login, the API should return a user object and a token (e.g., JWT).
    -   Store the token securely (e.g., in an HttpOnly cookie or `localStorage`) and update the `user` state in `App.tsx`.
    -   Implement a `useEffect` hook in `App.tsx` to check for a valid token on initial load to keep the user logged in.

3.  **Connect "Compose" Functionality:**
    -   In `ComposeView.tsx`, `ReelComposer.tsx`, and `EventComposer.tsx`, the `onPost`, `onCreateReel`, and `onCreateEvent` handlers should be wired to make `POST` requests to your backend API.
    -   Handle form data, including file uploads for reels, and send it to the appropriate endpoints.

4.  **Secure the Gemini API Key:**
    -   The `geminiService.ts` currently expects `process.env.API_KEY`. In a production environment, this client-side call is insecure.
    -   **Action:** Create a backend endpoint (e.g., `/api/generate-suggestion`) that securely calls the Gemini API from the server. The client-side `generatePostSuggestion` function should then call this new backend endpoint instead of the Gemini API directly.

By following these steps, you can transition the application from a mock-data prototype to a fully functional, data-driven platform.
