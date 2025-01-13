# Foreign News Mobile Documentation

## Table of Contents
1. [Reusable Components](#reusable-components)
2. [API Documentation](#api-documentation)
3. [Workflows](#workflows)
4. [Developer Onboarding](#developer-onboarding)

## Reusable Components

### NewsCard
- **Purpose**: Displays news article preview
- **Props**:
  - `article`: Article object containing title, description, image, etc.
  - `onPress`: Callback when card is pressed
  - `isSaved`: Boolean indicating if article is saved
- **Usage**:
```jsx
<NewsCard 
  article={article}
  onPress={handlePress}
  isSaved={isSaved}
/>
```

### CategoryCard
- **Purpose**: Displays news category
- **Props**:
  - `category`: Category object containing name and icon
  - `onPress`: Callback when card is pressed
- **Usage**:
```jsx
<CategoryCard
  category={category}
  onPress={handlePress}
/>
```

## API Documentation

### Article API
- **Endpoint**: `/api/articles`
- **Methods**:
  - `GET /`: Fetch all articles
  - `GET /:id`: Fetch single article
  - `POST /`: Create new article
  - `PUT /:id`: Update article
  - `DELETE /:id`: Delete article

### Authentication API
- **Endpoint**: `/api/auth`
- **Methods**:
  - `POST /login`: User login
  - `POST /register`: User registration
  - `POST /logout`: User logout

## Workflows

### Article Fetching Workflow
1. User opens app
2. System fetches articles from API
3. Articles are displayed in Home screen
4. User can:
   - Scroll through articles
   - Tap to view details
   - Save/unsave articles

### Authentication Workflow
1. User opens app
2. If not authenticated, redirect to login screen
3. User can:
   - Login with credentials
   - Register new account
   - Reset password

## Developer Onboarding

### Setup Instructions
1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npm start`

### Coding Standards
- Follow React Native best practices
- Use TypeScript for type safety
- Write unit tests for all components
- Document all new components and APIs

### Testing Guidelines
- Run unit tests: `npm test`
- Run end-to-end tests: `npm run cy:run`
- Run component tests: `npm run detox:test`
