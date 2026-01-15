# LapLocal

LapLocal is a region-based laptop marketplace designed to connect buyers and local shopkeepers across Pakistan through a centralized digital platform. The project focuses on improving transparency, accessibility, and efficiency in a traditionally fragmented laptop market by combining real-time inventory, smart filtering, and AI-powered recommendations.

---

## Overview

LapLocal allows users to browse all laptops available in a specific market (e.g., Gul Haji Plaza) without physically visiting multiple shops. At the same time, it gives sellers — especially those with low physical visibility — a digital storefront to showcase their inventory and manage operations.

The platform supports three roles:

* Buyers (or Visitors)
* Sellers (Shopkeepers)
* Admins (Platform Moderation)

---

## Problem LapLocal Solves

* Buyers waste time visiting multiple shops to compare laptops.
* Price discrepancies and lack of transparency create mistrust.
* Many sellers rely on manual inventory management.
* Shops on higher floors get less visibility despite good pricing.
* No centralized platform exists for regional laptop markets.

LapLocal addresses this with region-based listings, real-time inventory, smart filtering, and AI recommendations.

---

## Core Features

### Buyer / Visitor

* Browse laptops by region and market
* Advanced filters (budget, brand, RAM, storage, etc.)
* Search functionality
* AI-powered recommendations
* Product comparison
* View detailed product listings
* Chatbot for guidance and use-case based suggestions
* Real-time notifications and chat with sellers

### Seller

* Seller registration (admin approval required)
* Dashboard for inventory overview
* Add, update, delete products (CRUD)
* Real-time inventory updates
* Profile management
* Direct chat with buyers
* Increased visibility beyond physical shop location

### Admin

* Admin registration and login
* View all sellers
* View individual seller profiles
* Approve or reject seller accounts
* Platform moderation

---

## AI & Smart Components

* AI-based recommendation system based on user preferences and behavior
* Chatbot to guide non-technical buyers
* Personalized suggestions such as:

  * Best for students
  * Best for office work
  * Budget-friendly options
  * Performance-focused laptops

---

## Tech Stack

* Frontend: React (Web)
* Backend: Node.js (Express)
* Database: MongoDB
* Authentication: JWT / OAuth2
* Real-time: WebSockets / Firebase
* AI Module: Python (Scikit-learn / TensorFlow)
* Version Control: Git & GitHub

---

## Installation

Clone the repository:

```bash
git clone https://github.com/YusraSaeed/LapLocal-Complete.git
cd LapLocal-Complete
```

---

## Environment Setup

### Backend Setup

Move into backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend server:

```bash
npm run dev
```


Backend will run on:

```
http://localhost:5000
```

---

### Frontend Setup

Open a new terminal and move into frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

## How to Use

1. Run backend and frontend locally.
2. Open the app in browser.
3. Register as buyer or seller.
4. Sellers can manage inventory.
5. Buyers can browse, filter, compare, and use recommendations.

---

## Project Background

This project was developed as a Final Year Project (FYP) for the Department of Computer Science & IT, KPK University of Engineering & Technology, Peshawar.

Authors:

* Yusra Saeed
* Wali Akbar Khan
---

## Vision

To become the go-to digital marketplace for regional laptop markets in Pakistan, improving transparency, accessibility, and fairness for both buyers and sellers.
