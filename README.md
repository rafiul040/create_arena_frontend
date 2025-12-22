# Create Arena

Create Arena is a modern contest-based web platform where users participate in skill-based contests, creators host and manage contests, and admins control the overall system. The platform features secure payments, role-based dashboards, submissions, and real-time leaderboards.

![Create Arena Demo](demo.gif)

## 🚀 Platform Overview

Create Arena simulates a real-world competitive environment with proper role separation, secure workflows, and a scalable architecture.

## 👥 User Roles

- **Admin** – Manages users, contests, and creator approvals
- **Creator** – Creates contests and reviews submissions  
- **User** – Participates in contests and competes for rewards

## ✨ Core Features

- Role-based authentication & authorization
- Secure Stripe payment integration
- Contest creation and participation system
- Task submission and evaluation
- Real-time leaderboard
- Fully protected private and admin routes
- Responsive dashboard interface

## 📱 Main Pages & Routes

### Home
- Platform introduction
- Featured contests and highlights

### 📋 All Contests
- Browse all available contests
- View contest details
- Join contests using secure payment

### 🏆 Contest Details
- Contest rules, prize information, and deadlines
- Accessible only to authenticated users

### 🏅 Leaderboard
- Displays top performers and contest winners
- Updated dynamically based on results

## 📘 Additional Pages

### 🔍 How It Works
Explains the complete workflow:
1. Browse available contests
2. Join contests by completing payment
3. Submit contest tasks
4. Winners selected and displayed on leaderboard

### ℹ️ About Create Arena
- Platform mission and vision
- Role-based system explanation
- Technologies used

## 🔐 Authentication
- Login & Registration
- JWT-based authentication
- Route protection using PrivateRoute and AdminRoute

## 🧑‍💻 Dashboard (Role-Based Access)

### 👑 Admin Dashboard
- Manage Users
- Manage Contests
- Approve Creator Requests

### ✍️ Creator Dashboard
- Create and manage contests
- View created contests
- Review user submissions

### 👤 User Dashboard
- View participated contests
- View winning contests
- Payment history
- Profile management

##  Payment System
- Stripe payment gateway integration
- Payment success and cancellation handling
- Secure payment history tracking

## 🛠️ Technologies Used

### Frontend
- React
- React Router DOM
- TanStack Query
- Tailwind CSS
- DaisyUI
- SweetAlert2

### Backend
- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK
- Stripe API

## 🔒 Security Features
- JWT-based authentication
- Role-based authorization
- Admin-only protected actions
- Forbidden page for unauthorized access

## 📌 Project Highlights
- Clean and scalable folder structure
- Real-world role management system
- Fully responsive UI
- Production-ready routing strategy
- Practical implementation of payments and dashboards

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- Stripe account
- Firebase project

### Installation
