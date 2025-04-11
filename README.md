# I vibe-coded this

# Weight Tracker App

A Next.js (App Router) application for tracking weight measurements with PostgreSQL database and Chart.js visualization.

## Features

- User authentication via NextAuth.js
- Record weight measurements with dates and optional notes
- Visualize weight progress with interactive charts
- Responsive design with Tailwind CSS
- Server-side rendering for better performance
- PostgreSQL database for data storage

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your PostgreSQL database
4. Configure environment variables:

Copy the `.env.example` file to `.env` and update the following variables:

```
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your_secret_key>
GITHUB_ID=<your_github_oauth_id>
GITHUB_SECRET=<your_github_oauth_secret>
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE weight_tracker;
```

2. Update the `DATABASE_URL` in your `.env` file with the correct credentials
3. Run Prisma migrations:

```bash
npx prisma migrate dev
```

## Auth Setup

This app uses NextAuth.js with GitHub OAuth for authentication:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth application
3. Set the Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env` file

## Project Structure

- `src/app`: Next.js App Router
- `src/components`: React components
- `src/actions`: Server actions for data mutations
- `src/lib`: Utilities and configuration
- `prisma`: Database schema and migrations

## Deployment

For production deployment, make sure to:

1. Set up a production PostgreSQL database
2. Update the environment variables for production
3. Configure your OAuth provider with the production callback URL

## License

[MIT](LICENSE)
