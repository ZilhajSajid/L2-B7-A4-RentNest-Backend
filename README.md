````markdown
# 🏠 RentNest Backend

A scalable rental property marketplace backend built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. RentNest enables landlords to manage rental properties, tenants to request rentals and make secure Stripe payments, and administrators to oversee the platform.

---

## 🚀 Features

### 🌐 Public

- Browse all available rental properties
- Search and filter properties
- View property details
- View property categories

### 👤 Authentication

- User registration
- User login with JWT
- Protected routes
- Role-based authorization
- Get authenticated user profile

### 🏘️ Landlord

- Create property listings
- Update property listings
- Delete property listings
- View rental requests for owned properties
- Approve or reject rental requests

### 🏡 Tenant

- Submit rental requests
- View rental history
- View rental request details
- Secure Stripe payment integration
- View payment history
- View payment details
- Leave reviews after completing a rental

### 💳 Payments

- Stripe Checkout Session
- Payment confirmation
- Payment history
- Automatic rental activation after successful payment
- Automatically reject other pending/approved requests for the same property
- Update property availability after payment

### 🛡️ Admin

- View all users
- Ban/Unban users
- View all properties
- View all rental requests

---

# 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Stripe
- Zod
- bcrypt
- Cookie Parser
- CORS

---

# 📁 Project Structure

```text
src
├── app.ts
├── server.ts
├── config
├── lib
├── middlewares
├── modules
│   ├── auth
│   ├── user
│   ├── property
│   ├── rentalRequest
│   ├── payment
│   ├── review
│   └── admin
├── routes
└── utils
```

---

# 🔐 Authentication

Authentication is handled using JWT.

Protected routes require:

```
Authorization: Bearer <access_token>
```

Role-based authorization:

- ADMIN
- LANDLORD
- TENANT

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |

---

## Properties

| Method | Endpoint |
|---------|----------|
| GET | `/api/properties` |
| GET | `/api/properties/:id` |
| GET | `/api/categories` |

---

## Landlord

| Method | Endpoint |
|---------|----------|
| POST | `/api/landlord/properties` |
| PUT | `/api/landlord/properties/:id` |
| DELETE | `/api/landlord/properties/:id` |
| GET | `/api/landlord/requests` |
| PATCH | `/api/landlord/requests/:id` |

---

## Rental Requests

| Method | Endpoint |
|---------|----------|
| POST | `/api/rentals` |
| GET | `/api/rentals` |
| GET | `/api/rentals/:id` |

---

## Payments

| Method | Endpoint |
|---------|----------|
| POST | `/api/payments/create` |
| POST | `/api/payments/confirm` |
| GET | `/api/payments` |
| GET | `/api/payments/:id` |

---

## Reviews

| Method | Endpoint |
|---------|----------|
| POST | `/api/reviews` |

---

## Admin

| Method | Endpoint |
|---------|----------|
| GET | `/api/admin/users` |
| PATCH | `/api/admin/users/:id` |
| GET | `/api/admin/properties` |
| GET | `/api/admin/rentals` |

---

# 💳 Stripe Payment Flow

1. Tenant submits a rental request.
2. Landlord approves the request.
3. Tenant creates a Stripe Checkout Session.
4. Tenant completes payment.
5. Payment is confirmed.
6. Rental request becomes **ACTIVE**.
7. Property availability becomes **RENTED**.
8. All other pending/approved rental requests for the same property are automatically rejected.

---

# 🗄️ Database Models

- User
- Property
- Category
- RentalRequests
- Payment
- Reviews

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

BCRYPT_SALT_ROUNDS=

STRIPE_SECRET_KEY=

APP_URL=
```

---

# 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

---

# 📜 Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npx prisma studio
npx prisma migrate dev
npx prisma generate
```

---

# 📈 Business Rules

- Only landlords can manage their own properties.
- Only tenants can submit rental requests.
- Rental requests must be approved before payment.
- Only the assigned tenant can pay for an approved rental.
- Successful payment changes the rental status to **ACTIVE**.
- Successful payment changes the property status to **RENTED**.
- Other pending/approved requests for the same property are automatically rejected.
- Only tenants with a **COMPLETED** rental can leave a review.
- Admins can manage users, properties, and rental requests.

---

# 👨‍💻 Author

**Md. Zilhaj Un Noor**

GitHub: https://github.com/ZilhajSajid

---

# 📄 License

This project is developed for educational purposes as part of a backend web development assignment.
````
