# Fundsroom ERP + CRM

A full-stack ERP & CRM web application built for small and medium-sized businesses to manage customers, products, inventory, and sales operations from a unified dashboard.

---

## Live Demo

### Frontend

https://fundsroom-erp-crm-beta.vercel.app

### Backend API

https://fundsroom-erp-crm-2.onrender.com

---

## Features

### Dashboard

- Business overview dashboard
- Customer statistics
- Product overview
- Inventory summary
- Revenue analytics
- Low stock indicators
- Recent activity cards

### Customer Management

- Add customers
- Edit customer information
- Delete customers
- Search customers
- View customer details

### Product Management

- Add products
- Product categorization
- SKU management
- Unit price management
- Inventory tracking

### Inventory Management

- Product inventory overview
- Stock tracking
- Low stock monitoring
- Category-wise inventory

### Sales Challans

- Create challans
- Customer mapping
- Product mapping
- Challan management

### Authentication

- JWT Authentication
- Secure login
- Protected API routes
- Role-ready architecture

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation
- Bcrypt

### Database

- PostgreSQL

### Deployment

- Frontend: Vercel
- Backend: Render

---

## Project Structure

```
fundsroom-erp-crm/

├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── generated/
│   └── package.json
│
└── README.md
```

---

## Screens

- Login
- Dashboard
- Customers
- Products
- Inventory
- Sales Challans

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/adarshsinghh13/fundsroom-erp-crm.git

cd fundsroom-erp-crm
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secret_key

PORT=5000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://fundsroom-erp-crm-2.onrender.com/api
```

---

## REST API

### Authentication

- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/profile

### Customers

- GET /api/customers
- POST /api/customers
- PATCH /api/customers/:id
- DELETE /api/customers/:id

### Products

- GET /api/products
- POST /api/products
- PATCH /api/products/:id
- DELETE /api/products/:id

### Inventory

- GET /api/inventory

### Sales Challans

- GET /api/challans
- POST /api/challans
- PATCH /api/challans/:id
- DELETE /api/challans/:id

---

## Demo Credentials

```
Email:
adarsh2@example.com

Password:
Password123
```

---

## Future Enhancements

- Purchase Orders
- GST Invoice Generation
- Invoice PDF Export
- Excel Reports
- Email Notifications
- Supplier Management
- Multi-company Support
- Advanced Reporting
- Role-Based Access Control
- Dashboard Analytics
- Dark Mode

---

## Author

**Adarsh Singh**

- GitHub: https://github.com/adarshsinghh13

---

## License

This project is licensed under the MIT License.
