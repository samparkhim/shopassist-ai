# ShopAssist AI

AI-powered customer support agent for e-commerce platforms.

## Overview
ShopAssist AI is an intelligent commerce support assistant that automates repetitive customer support workflows including product queries, order tracking, returns, refunds, policy clarification, and human escalation.

Built as a hackathon MVP with a futuristic AI conversational interface.

---

## Features

### Product Support
Supports:
- waterproof checks
- warranty lookup
- compatibility information
- size availability

Examples:
- Is SmartFit Watch waterproof?
- What warranty does SmartFit Watch have?
- What sizes are available for AirFlex Running Shoes?

---

### Order Tracking Workflow
Multi-turn interaction.

Example:
Customer:
Where is my order?

Agent:
Please provide your order ID.

Customer:
ORD1002

Agent:
Your order has been successfully delivered.

---

### Return / Refund Workflow
Interactive workflow.

Example:
Customer:
I want refund

Agent:
Please provide your order ID.

Customer:
ORD1001

Agent:
Return request successfully created.

---

### Policy Assistant
Handles:
- return policy
- refunds
- shipping
- cancellation

---

### Human Escalation
Detects frustrated customers.

Triggers:
- worst service
- angry
- talk to human
- bad service

---

### Modern AI Interface
Includes:
- futuristic dark UI
- quick action buttons
- loading states
- chat UX

---

## Tech Stack

Frontend:
- React
- Vite
- CSS

Backend:
- Node.js
- Express.js
- CORS
- dotenv

Storage:
- JSON-based mock persistence

---

## Architecture

Frontend (React + Vite)
↓
Backend API (Express)
↓
Intent Detection
↓
Workflow Orchestrator
↓
Business Logic Handlers
↓
Store Data Layer

---

## Project Structure

```bash
commerce-ai-agent/
│
├── backend/
│   ├── server.js
│   ├── data/
│   │   ├── products.json
│   │   ├── orders.json
│   │   ├── policies.json
│   │   ├── returns.json
│   ├── .env
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│
├── public/
├── package.json
├── package-lock.json
├── vite.config.js
├── index.html
├── README.md
```

---

## Setup

### Install dependencies
```bash
npm install
```

### Start frontend
```bash
npm run dev
```

Frontend:
```bash
http://localhost:5173
```

---

### Start backend
```bash
cd backend
npm install
node server.js
```

Backend:
```bash
http://localhost:5000
```

---

## API

### POST /chat

Request:
```json
{
  "message": "Where is my order?"
}
```

Response:
```json
{
  "reply": "Sure. Please provide your order ID to track your shipment."
}
```

---

## Future Improvements
- Shopify integration
- database persistence
- authentication
- multilingual support
- LLM-powered intelligence
- analytics dashboard
- ticketing system integration

---

## Demo Scenarios
Try:
- Where is my order?
- I want refund
- What is your return policy?
- Is SmartFit Watch waterproof?
- I want to talk to a human agent

---

## Project
Hackathon MVP submission — ShopAssist AI