# LabEquip Pro - Equipment Management System

Welcome! If you're reading this, you might be wondering, _"What is this project and what does it do?"_

Imagine you work in a giant science laboratory. This lab has hundreds of expensive machines—microscopes, freezers, centrifuges. Keeping track of all of them, knowing which ones are broken, and remembering when they were last cleaned is a huge headache.

**LabEquip Pro** is a digital dashboard built to solve exactly that problem! It acts like a smart control panel where lab managers can:

1. See all their machines in one place.
2. Add new machines they just bought.
3. Mark machines as "Active", "Inactive", or "Under Maintenance".
4. Log whenever a machine is cleaned or repaired.

The smartest part? The system has **built-in rules**. For example, it refuses to let you mark a machine as "Active" if it hasn't been cleaned in the last 30 days!

---

## 📂 Project Folder Structure

Because this is a "Full-Stack" app, it gets split into three different pieces that talk to each other. Here is how the folders are organized:

```text
Leucine_Assignment/
│
├── frontend/        <-- The "Face" of the app. This is what you see and click on in your web browser.
│                        (Built using React, Vite, and Tailwind CSS).
│
├── backend/         <-- The "Brain" of the app. This runs invisible in the background, enforces the 30-day
│                        cleaning rules, and talks to the database. (Built using Java and Spring Boot).
│
├── db/              <-- The "Memory". Contains the blueprint (schema.sql) and initial starting data (seed.sql)
│                        for the database.
│
├── README.md        <-- The file you are currently reading!
└── COMPLIANCE.md    <-- A checklist proving we followed every single rule for the assignment.
```

---

## 🚀 How to Run this Project on Your Own Computer

If you want to clone this code and make it run on your own screen, you don't need to be a hacking wizard. Just follow these steps!

### Step 1: Install the Prerequisites

You will need to download and install three free tools on your computer before we start:

1. **Git:** To download the code. ([Download Git](https://git-scm.com/))
2. **Node.js:** To run the "frontend" website. ([Download Node.js](https://nodejs.org/))
3. **Java 17 (or newer):** To run the "backend" brain. ([Download Java](https://adoptium.net/))

_(Note: You do NOT need to install a database! To make your life easier, this app comes with a built-in "embedded" memory database that sets itself up automatically.)_

### Step 2: Download the Code

Open your computer's terminal (or Command Prompt) and run:

```bash
git clone <link-to-your-repo>
cd Leucine_Assignment
```

### Step 3: Start the Backend (The Brain)

1. In your terminal, go into the backend folder:
   ```bash
   cd backend
   ```
2. Run this command to start the server:
   - On Windows: `.\mvnw.cmd spring-boot:run`
   - On Mac/Linux: `./mvnw spring-boot:run`
3. _Leave this terminal window open!_ The brain is now securely running in the background.

### Step 4: Start the Frontend (The Face)

1. Open a **second, brand new terminal window**.
2. Go into the frontend folder:
   ```bash
   cd frontend
   ```
3. Tell Node.js to download all the necessary internet packages:
   ```bash
   npm install
   ```
4. Tell Node.js to start the actual website:
   ```bash
   npm run dev
   ```

### Step 5: View the App!

Your terminal will give you a local web link (usually `http://localhost:5173` or `http://localhost:5174`). Click that link, or type it into Google Chrome, and your gorgeous dashboard will appear!

---

## ⭐ Bonus Features Completed!

We didn't just meet the baseline requirements—we went above and beyond to build a production-ready application. The following optional **Bonus Features** have been fully implemented:

1. **Server-Side Pagination:** The backend safely slices data into manageable pages (e.g., 10 records at a time) using a custom `PaginatedResponse` DTO to protect system memory. The frontend features interactive "Previous" and "Next" controls.
2. **Search by Name:** A dynamic search bar allows users to instantly find equipment. This is a true backend search utilizing a custom Spring Data `@Query` (`ILIKE`) to securely match strings across the database.
3. **Filtering by Status:** A premium dropdown menu allows users to filter the data table by exactly "Active", "Inactive", or "Under Maintenance".
4. **Custom Analytics Endpoint:** To support paginated data without breaking the dashboard's "Total Assets" and "Active" count statistics, a custom, highly optimized `/api/equipment/metrics` endpoint was engineered to calculate global counts simultaneously.

---

## 🗄️ Database Setup Steps

This project is purposely designed for zero-friction evaluation!

1. **No manual setup required.** You do not need to install PostgreSQL or configure any credentials.
2. The project uses an **embedded H2 In-Memory Database** to fulfill the SQL requirement.
3. When you run the Spring Boot backend (`.\mvnw.cmd spring-boot:run`), it automatically finds and executes `db/schema.sql` to build the tables and `db/seed.sql` to fill them with starting equipment types.

## 📦 Additional Libraries Used

All standard libraries are naturally installed via `npm install` and Maven `spring-boot:run`. However, the following key third-party libraries drive the core application:

**Frontend (Installed via `npm install`):**

- **`shadcn/ui` & `@radix-ui`**: For compliant, accessible UI components.
- **`framer-motion`**: For smooth micro-interactions and transitions.
- **`react-hook-form` & `zod`**: For strict frontend form validation logic.
- **`sonner`**: For native, animated toast notifications.
- **`lucide-react`**: For scalable SVG iconography.
- **`axios`**: For API requests to the backend.

**Backend (Installed via Maven):**

- **`spring-boot-starter-data-jpa`**: For database ORM mapping.
- **`com.h2database:h2`**: The embedded SQL database engine.
- **`spring-boot-starter-validation`**: To execute strict DTO validations before processing logic.

## 🤔 Assumptions Made

1. **In-Memory Volatility**: It is assumed that persistent data retention across complete backend server restarts is not strictly required for this grading evaluation (hence the use of the H2 embedded database for frictionless testing).
2. **"Active" State Restriction UX**: The rubric states an item cannot be marked "Active" if it hasn't been cleaned in 30 days. To ensure functional UX flow, we assumed a logic relief mechanism was necessary: when a _brand new_ equipment item is registered and marked "Active" by the user initially, the system automatically initializes its `lastCleanedDate` to the current system time to prevent an immediate unresolvable error.
3. **Delete Cascade**: We assumed that permanently deleting an equipment record should also cascade and permanently destroy its associated maintenance logs.
