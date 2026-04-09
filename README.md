# Node.js Practices

A server-side rendered web application built with Express, Pug, Tailwind CSS, and Prisma ORM.

## Database Setup

See [README-db.md](README-db.md) for Prisma/PostgreSQL setup and Docker instructions.

## Tech Stack

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

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `POSTGRES_DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

## Project Structure

```
├── app.js                      # Express app setup & middleware
├── bin/www                     # Server entry point
├── middleware/
│   ├── authentication.js       # Passport JWT — attaches req.user from cookie
│   ├── authorization.js        # requireAuth & requireRole guards
│   └── logger.js               # Custom request logger
├── prisma/
│   └── schema.prisma           # Database schema (User, Post, Category, Tag, Profile)
├── routes/
│   ├── index.js                # Home & About pages
│   ├── auth.js                 # Login, Register, Logout (POST/GET)
│   ├── users.js                # User listing & detail pages
│   └── admin/
│       └── posts.js            # Admin post management (protected)
├── src/
│   └── auth/
│       ├── passport.js         # Strategy registration hub
│       ├── local.strategy.js   # Email + password authentication
│       └── jwt.strategy.js     # JWT cookie extraction & verification
├── validations/
│   └── user.js                 # Zod schemas (login, register, userId param)
├── views/
│   ├── layouts/main.pug        # Base layout
│   ├── pages/                  # Home, About
│   ├── users/                  # Login, Register, Logout, User list/detail
│   ├── admin/posts/            # Admin views
│   └── partials/               # Header, Footer, Block
└── public/
    └── stylesheets/            # Compiled Tailwind CSS
```

## Authentication Architecture

### Flow

1. **Login**: User submits form → Zod validates → Passport Local authenticates (bcrypt) → JWT signed → httpOnly cookie set → redirect to home
2. **Every request**: `attachUserFromJWT` middleware reads cookie → Passport JWT verifies → `req.user` set → `res.locals.user` available in all views
3. **Logout**: Cookie cleared → redirect to home
4. **Register**: Zod validates → check duplicate email → bcrypt hash password → create user → redirect to login

### Key Decisions

- **No sessions**: Fully stateless via JWT in httpOnly cookies
- **No client-side JS for auth**: All flows use standard form POST and server redirects
- **Cookie-based JWT**: Token stored in httpOnly cookie (not Authorization header or localStorage) for security
- **Role-based access**: Admin routes protected with `requireRole('admin')` middleware in `app.js`
- **Validation before auth**: Zod schemas validate input before Passport processes it

### User Roles

- `user` (default) — can access public pages
- `admin` — can access `/admin/*` routes

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with CSS watch & nodemon |
| `npm start` | Start production server |
| `npm run build:css` | Build minified Tailwind CSS |
| `npm run debug:dev` | Start with debug logging & inspector |
