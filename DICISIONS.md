# Decision Log — ShopAssist AI

## 1. Pure AI Chatbot vs Hybrid Architecture
**Considered:** Building the entire support assistant as a pure LLM chatbot.

**Chose:** Hybrid architecture (deterministic workflows + AI reasoning).

**Reason:** Operational workflows such as order tracking, refunds, and policy handling require predictable, reliable execution. AI is better suited for natural language reasoning, not critical workflow control.

---

## 2. Traditional Multi-Page Support UI vs Chat-Based Interface
**Considered:** Separate forms/pages for order tracking, returns, and support.

**Chose:** Conversational chat interface.

**Reason:** Customers are already familiar with chat-based support. A single conversational interface reduces friction and supports both structured workflows and unstructured questions.

---

## 3. Direct Product Lookup vs AI for Everything
**Considered:** Sending every query to the LLM.

**Chose:** Deterministic handling for known product queries, AI fallback for contextual queries.

**Reason:** Known product facts (waterproof status, warranty, sizes) should be fast and reliable. AI remains available for reasoning-heavy questions like “Can I wear this while swimming?”

---

## 4. Real Database vs Lightweight Mock Data
**Considered:** Integrating a database such as MongoDB or PostgreSQL.

**Chose:** JSON-based structured mock storage.

**Reason:** For hackathon execution speed, lightweight structured files allowed rapid development while still demonstrating workflow logic clearly.

---

## 5. Authentication vs Open MVP Access
**Considered:** User authentication and account-based order access.

**Chose:** Open MVP interaction without authentication.

**Reason:** Authentication would add implementation complexity without materially improving demonstration of the core support automation concept.

---

## 6. Single AI Provider vs Fallback Routing
**Considered:** Using one LLM endpoint only.

**Chose:** Multi-model fallback routing.

**Reason:** Free AI providers can be unreliable or rate-limited. Fallback routing improves availability and demo reliability.

---

## 7. Full Marketplace Integration vs Focused MVP
**Considered:** Shopify / WooCommerce / real commerce platform integration.

**Chose:** Standalone MVP support assistant.

**Reason:** The objective was validating the support automation experience, not platform integration complexity.

---

## 8. Human Escalation as Optional vs Core Capability
**Considered:** Keeping the assistant fully automated.

**Chose:** Built-in frustration detection and escalation.

**Reason:** Real customer support systems need clear escalation paths. Automation should assist support teams, not completely replace human intervention.

---

## 9. Local Demo vs Production Deployment
**Considered:** Keeping the project as a local prototype.

**Chose:** Full deployment on Vercel + Render.

**Reason:** A live deployed product demonstrates stronger engineering maturity and allows real-world validation.

---

## 10. Feature Breadth vs Execution Quality
**Considered:** Adding analytics dashboards, CRM integration, multilingual support, and voice support.

**Chose:** Focused MVP with strong core workflows.

**Reason:** Prioritized a polished, working product over excessive incomplete scope.
