# Quick Start: Run Postgres with Docker

```sh
docker run --name nodejs_practices_postgres \
	-e POSTGRES_USER=postgres \
	-e POSTGRES_PASSWORD=postgres \
	-e POSTGRES_DB=mydb \
	-p 5432:5432 \
	-d postgres:16
```

# Prisma + PostgreSQL Setup

## 1. Environment
- Set `POSTGRES_DATABASE_URL` in your `.env` file.

## 2. Schema
- Define your data models in `prisma/schema.prisma`.

## 3. Install & Initialize
- Install dependencies:
	- `npm install @prisma/client prisma --save-dev`
- Initialize Prisma:
	- `npx prisma init`

## 4. Migrate & Generate
- Run migrations:
	- `npx prisma migrate dev`
- Generate Prisma Client:
	- `npx prisma generate`

## 5. Usage Example
```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example: Fetch all users
async function main() {
	const users = await prisma.user.findMany();
	console.log(users);
}
main();
```

## 6. Prisma CLI
- `npx prisma init` — Initialize Prisma
- `npx prisma migrate dev` — Run migrations
- `npx prisma db push` — Push schema changes
- `npx prisma studio` — GUI for your database

---

Use Prisma Client for all PostgreSQL queries. See the [Prisma docs](https://www.prisma.io/docs/) for more details.
