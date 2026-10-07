# 🔄 FindBack

A full-stack web application for reporting, searching, and managing lost and found items.

## Tech Stack
- **Frontend**: React.js + Axios
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT

## Project Structure
```
lost_things_uts/
├── backend/          # Node.js + Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/         # React.js App
    ├── public/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        └── pages/
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Edit with your values
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT |
| GET | /api/auth/me | Get current user |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/items | Get all items (with filters) |
| GET | /api/items/:id | Get single item |
| POST | /api/items | Create item (protected) |
| PUT | /api/items/:id | Update item (owner only) |
| DELETE | /api/items/:id | Delete item (owner only) |

### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/claims | Submit a claim |
| GET | /api/claims/my | Get my claim requests |
| GET | /api/claims/item/:itemId | Get claims for an item (owner) |
| PUT | /api/claims/:id | Approve/Reject a claim (owner) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Get statistics |
