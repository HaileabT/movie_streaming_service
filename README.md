# Movie Streaming Platform

A movie streaming platform built with Next.js, tailwindcss v4, TypeScript, and PostgreSQL. This project demonstrates a full-stack application with authentication, movie browsing, and user interactions.

## Participants

| Name            | Role     | Contribution                                |
| --------------- | -------- | ------------------------------------------- |
| Yohannis Abebe  | Frontend | Utility Components, auth pages, and styling |
| Aphomia Wodajo  | Frontend | Movie details page, footer, and styling     |
| Yibraleh Ayele  | Frontend | Favorites page and watch later page         |
| Haileab Tesfaye | Backend  | The backend as a whole                      |

## Features

### Authentication

- ✅ Sign up and sign in with JWT-based authentication
- ✅ Sign out functionality
- ✅ Change password for authenticated users
- ✅ HTTP-only cookie-based session management

### Public Features (No Auth Required)

- ✅ Movie listing with pagination
- ✅ Search movies by keyword
- ✅ Filter movies by genre
- ✅ Movie details page with trailer playback

### Authenticated Features

- ✅ Add/remove movies to favorites
- ✅ Add/remove movies to watch later list
- ✅ Rate movies (1-5 stars)
- ✅ View personal favorites and watch later lists

### Technical Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ PostgreSQL database with Prisma ORM
- ✅ TMDB API integration for movie data
- ✅ Video.js for trailer playback
- ✅ Tailwind CSS v4 for styling
- ✅ Responsive design
- ✅ Proper HTTP status codes
- ✅ Error handling

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Styling**: Tailwind CSS v4
- **Video Player**: Video.js
- **HTTP Client**: Axios
- **Movie Data**: TMDB API

## Prerequisites

- Node.js 18+
- PostgreSQL database
- TMDB API key

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd movie-streaming-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/movie_streaming"
TMDB_API_KEY="your_tmdb_api_key_here"
JWT_SECRET="your_jwt_secret_key_here"
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push
```

### 5. Get a TMDB API key

1. Go to [TMDB](https://www.themoviedb.org/)
2. Create an account
3. Go to Settings > API
4. Request an API key
5. Add the API key to your `.env.local` file

### 6. Generate JWT Secrect

```bash
npm generate:secret
```

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── movies/        # Movie-related endpoints
│   │   ├── genres/        # Genre endpoints
│   │   └── user/          # User-specific endpoints
│   ├── movie/             # Movie detail pages
│   ├── favorites/         # User favorites page
│   ├── watch-later/       # User watch later page
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility libraries
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── public/               # Static assets
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `PUT /api/auth/change-password` - Change password

### Movies

- `GET /api/movies` - Get movies (with pagination, search, genre filter)
- `GET /api/movies/[id]` - Get movie details
- `GET /api/genres` - Get all genres

### User Features (Authenticated)

- `GET /api/user/favorites` - Get user favorites
- `POST /api/user/favorites` - Add to favorites
- `DELETE /api/user/favorites` - Remove from favorites
- `GET /api/user/watch-later` - Get watch later list
- `POST /api/user/watch-later` - Add to watch later
- `DELETE /api/user/watch-later` - Remove from watch later
- `GET /api/user/ratings` - Get user ratings
- `POST /api/user/ratings` - Rate a movie
- `DELETE /api/user/ratings` - Remove rating

## Database Schema

The application uses the following database models:

- **User**: User accounts with email and password
- **MovieMeta**: Movie metadata from TMDB
- **Favorite**: User favorites relationship
- **WatchLater**: User watch later relationship
- **Rating**: User movie ratings

## Features in Detail

### Movie Browsing

- Browse popular movies with pagination
- Search movies by title
- Filter by genre using sidebar
- View movie details with trailers

### User Interactions

- Add/remove movies to favorites
- Add/remove movies to watch later
- Rate movies with 1-5 stars
- View personal lists

### Video Playback

- YouTube trailer integration using Video.js
- Responsive video player
- Custom video player styling

### Authentication

- Secure JWT-based authentication
- HTTP-only cookies for session management
- Password hashing with bcryptjs
- Protected routes for user features

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent component structure
- Proper error handling

## Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `DATABASE_URL` - Production PostgreSQL connection string
- `TMDB_API_KEY` - Your TMDB API key
- `JWT_SECRET` - Strong secret for JWT signing
- `NODE_ENV` - Set to "production"

### Database Migration

For production, use Prisma migrations instead of `db:push`:

```bash
npx prisma migrate dev --name init
```

## License

This project is for educational purposes and internship demonstration.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [Next.js](https://nextjs.org/) for the framework
- [Prisma](https://www.prisma.io/) for database ORM
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Video.js](https://videojs.com/) for video playback
