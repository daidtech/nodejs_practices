# Node.js Practices

A server-side rendered web application built with **TypeScript**, Express, Pug, Tailwind CSS, and Prisma ORM.

## Database Setup

See [README-db.md](README-db.md) for Prisma/PostgreSQL setup and Docker instructions.

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Template Engine**: Pug
- **CSS**: Tailwind CSS
- **ORM**: Prisma (PostgreSQL)
- **Authentication**: Passport.js (Local + JWT strategies)
- **Validation**: Zod

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Run Prisma migrations
npx prisma migrate dev

# Start development server (uses ts-node, no build step needed)
npm run dev

# Or build and run production
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `POSTGRES_DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

## Project Structure

```
├── app.ts                       # Express app setup & middleware
├── bin/www.ts                   # Server entry point
├── tsconfig.json                # TypeScript configuration
├── middleware/
│   ├── authentication.ts        # Passport JWT — attaches req.user from cookie
│   ├── authorization.ts         # requireAuth & requireRole guards
│   └── logger.ts                # Custom request logger
├── prisma/
│   └── schema.prisma            # Database schema (User, Post, Category, Tag, Profile)
├── routes/
│   ├── index.ts                 # Home & About pages
│   ├── auth.ts                  # Login, Register, Logout (POST/GET)
│   ├── users.ts                 # User listing, detail, profile pages
│   └── admin/
│       └── posts.ts             # Admin post management (protected)
├── src/
│   ├── auth/
│   │   ├── passport.ts          # Strategy registration hub
│   │   ├── local.strategy.ts    # Email + password authentication
│   │   └── jwt.strategy.ts      # JWT cookie extraction & verification
│   └── types/
│       └── express.d.ts         # Express.User type augmentation (Prisma User)
├── validations/
│   └── user.ts                  # Zod schemas (login, register, userId param)
├── scripts/
│   └── seed.ts                  # Database seeding script
├── views/
│   ├── layouts/main.pug         # Base layout
│   ├── pages/                   # Home, About
│   ├── users/                   # Login, Register, Profile, Logout, User list/detail
│   ├── admin/posts/             # Admin views
│   └── partials/                # Header, Footer, Block
├── public/
│   └── stylesheets/             # Compiled Tailwind CSS
└── dist/                        # Compiled JS output (gitignored)
```

## Authentication Architecture

### Flow

1. **Register**: User submits form → Zod validates → bcrypt hash → Prisma create → redirect to login
2. **Login**: User submits form → Zod validates → Passport Local authenticates (bcrypt) → JWT signed → httpOnly cookie set → redirect to home
3. **Every request**: `attachUserFromJWT` middleware reads cookie → Passport JWT verifies → `req.user` set → `res.locals.user` available in all views
4. **Profile**: Logged-in user clicks their name in header → `/users/profile` renders profile with account details
5. **Logout**: Cookie cleared → redirect to home

### Key Decisions

- **TypeScript**: All source files are `.ts` with strict mode enabled
- **No sessions**: Fully stateless via JWT in httpOnly cookies
- **No client-side JS for auth**: All flows use standard form POST and server redirects
- **Cookie-based JWT**: Token stored in httpOnly cookie (not Authorization header or localStorage) for security
- **Role-based access**: Admin routes protected with `requireRole('admin')` middleware in `app.ts`
- **Validation before auth**: Zod schemas validate input before Passport processes it

### User Roles

- `user` (default) — can access public pages and profile
- `admin` — can additionally access `/admin/*` routes

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with ts-node + CSS watch + nodemon |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Start production server from `dist/` |
| `npm run seed` | Seed database with sample data |
| `npm run build:css` | Build minified Tailwind CSS |
| `npm run debug:dev` | Start with debug logging & inspector |
