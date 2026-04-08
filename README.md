# nodejs-practices

## Database Setup

See [README-db.md](README-db.md) for Prisma/PostgreSQL setup and Docker instructions.
# Node.js Practices

A personal project for learning Node.js, Express.js, Tailwind CSS, and REST APIs.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Pug + Tailwind CSS

## Mini Project: Products CRUD API

This project now includes a basic real-world CRUD example using `Express + Mongoose`.

### Product fields
- `name` (string, required)
- `price` (number, required)
- `description` (string)
- `category` (string)
- `inStock` (boolean)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.example .env
```

3. Make sure MongoDB is running locally, or set `MONGODB_URI` to your database.

4. Start the app:

```bash
npm run dev
```

## API Endpoints

Base URL:

```text
http://localhost:3000/api/products
```

### Create product
```http
POST /api/products
Content-Type: application/json
```

```json
{
  "name": "Mechanical Keyboard",
  "price": 99.99,
  "description": "Hot-swappable RGB keyboard",
  "category": "electronics",
  "inStock": true
}
```

### Get all products
```http
GET /api/products
```

### Get one product
```http
GET /api/products/:id
```

### Update product
```http
PUT /api/products/:id
Content-Type: application/json
```

```json
{
  "price": 79.99,
  "inStock": false
}
```

### Delete product
```http
DELETE /api/products/:id
```

> If MongoDB is not connected, the API returns `503` with a helpful message.

## Mongo Console Helper

This project also includes a small MongoDB console helper that auto-loads all models from the `models/` folder into `global`.

### Run it

```bash
npm run c
```

### What it does
- connects to MongoDB using `MONGODB_URI`
- scans `models/*.js`
- registers each model on `global`
- also exposes them as `global.models`
- Help developers quick test query, action
### Example usage

```js
await Product.find()
await User.find()
Object.keys(global.models)
```

So if you add a new file like `models/Order.js`, it will be loaded automatically the next time you run the console.
