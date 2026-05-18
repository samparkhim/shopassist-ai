# ShopAssist AI

AI-powered customer support automation for modern e-commerce.

ShopAssist AI combines deterministic workflow automation with AI-powered conversational support to handle common customer service queries such as order tracking, refunds, returns, product FAQs, policy support, and escalation handling.

## Live Demo

**Frontend:** https://shopassist-ai-beta.vercel.app  
**Backend API:** https://shopassist-backend.onrender.com

---

## Problem

E-commerce support teams spend significant time answering repetitive customer queries:

- Where is my order?
- I want a refund
- What is your return policy?
- Is this product waterproof?

This leads to slower response times, higher operational costs, and inconsistent customer experience.

ShopAssist AI solves this through automated support workflows and AI-assisted natural language interaction.

---

## Features

- Order tracking workflow
- Refund / return initiation
- Shipping / refund / return policy support
- Product FAQ handling
- Human escalation detection
- AI-powered conversational assistance
- Sentiment-aware support routing
- Hybrid deterministic + LLM architecture

---

## Tech Stack

**Frontend**
- React
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- Axios

**AI**
- OpenRouter API
- Multi-model fallback LLM routing

**Deployment**
- Vercel
- Render
- GitHub

---

## Architecture

```text
User
 ↓
React Frontend
 ↓
REST API (/chat)
 ↓
Express Backend
 ↓
Intent Router
 ├── Order Tracking
 ├── Refund / Return Workflow
 ├── Policy Handler
 ├── Product Query Handler
 └── AI Reasoning Layer
 ↓
Response Engine
```

---

## Example Queries

Try these on the live demo:

```text
Where is my order?
ORD1002

I want refund
ORD1001

What is your return policy?

Is SmartFit Watch waterproof?

Can I wear the SmartFit Watch while swimming?

I'm not happy with this experience
```

---

## Documentation

### Product Document
[Upload Product Document PDF here](./docs/product-document.pdf)

### Technical Document
[Upload Technical Document PDF here](./docs/technical-document.pdf)

---

## Local Setup

Clone the repository:

```bash
git clone https://github.com/samparkhim/shopassist-ai.git
cd shopassist-ai
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create environment file:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Run backend:

```bash
node server.js
```

Run frontend:

```bash
cd ..
npm run dev
```

---

## Future Scope

- Shopify integration
- Real database support
- CRM integration
- Multilingual support
- Voice support
- Admin analytics dashboard
- Real human ticket routing

---

## Project Vision

ShopAssist AI is designed as a practical support automation product, not just a chatbot.

By combining workflow reliability with AI reasoning, it delivers scalable customer support for modern commerce platforms.
