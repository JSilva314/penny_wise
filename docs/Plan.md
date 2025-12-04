# PennyWise Development Plan

## Project Overview

PennyWise is a personal budgeting application designed to help users track their income and expenses, create budgets, and gain insights into their spending habits. The MVP will focus on core budgeting functionality with a clean, intuitive interface.

## MVP Scope - Core Features Only

The Minimum Viable Product will include **essential budgeting features** to allow users to manage their finances effectively.

### Must-Have Features (MVP)

1. **User Authentication**
   - Sign up / Sign in / Sign out
   - Email/password authentication
   - Secure session management
   - User profile

2. **Dashboard**
   - Overview of current month finances
   - Total income vs total expenses
   - Remaining budget visualization
   - Quick stats (spending by category)
   - Recent transactions list (last 10)

3. **Transaction Management**
   - Add income/expense transactions
   - Fields: date, amount, category, description, type (income/expense)
   - Edit existing transactions
   - Delete transactions
   - View all transactions (paginated list)
   - Filter by date range, category, or type

4. **Budget Categories**
   - Pre-defined categories (Housing, Food, Transportation, Entertainment, etc.)
   - Set monthly budget limits per category
   - View spending vs budget per category
   - Visual indicator (progress bars) for budget usage

5. **Basic Reports**
   - Monthly summary (income vs expenses)
   - Spending by category (pie chart)
   - Income vs expenses over time (line/bar chart)
   - Export data to CSV

### Nice-to-Have (Post-MVP)

These features will be implemented **after** the MVP is complete:

- Recurring transactions
- Multiple budgets (monthly, weekly, yearly)
- Savings goals
- Bill reminders
- Receipt uploads
- Multi-currency support
- Mobile app
- Bank account integration
- Advanced analytics
- Budget templates
- Shared budgets (family/household)

---

## Development Phases

### Phase 1: Foundation & Setup (Week 1)
**Goal**: Set up development environment and core infrastructure

**Tasks**:
- [x] Initialize Next.js project with TypeScript and Tailwind
- [ ] Choose and set up database (Recommended: Supabase or Prisma + PostgreSQL)
- [ ] Set up authentication system (Recommended: Clerk or NextAuth.js)
- [ ] Install core dependencies (UI components, forms, validation)
- [ ] Set up project structure (components, lib, types folders)
- [ ] Create database schema/models
- [ ] Set up environment variables
- [ ] Create base layout and navigation

**Deliverable**: Working app skeleton with auth and database connected

---

### Phase 2: Core Features - Transactions (Week 2)
**Goal**: Implement transaction management

**Tasks**:
- [ ] Design transaction data model
- [ ] Create transaction form component (add/edit)
- [ ] Build transaction list view with pagination
- [ ] Implement CRUD operations (Create, Read, Update, Delete)
- [ ] Add form validation (Zod schemas)
- [ ] Create filter/search functionality
- [ ] Add date picker component
- [ ] Implement category selection
- [ ] Add success/error notifications

**Deliverable**: Users can add, view, edit, and delete transactions

---

### Phase 3: Categories & Budgets (Week 3)
**Goal**: Implement budget management

**Tasks**:
- [ ] Define default category list
- [ ] Create category management interface
- [ ] Build budget setting form (per category)
- [ ] Calculate budget vs actual spending
- [ ] Create budget progress indicators
- [ ] Add budget warnings (near/over limit)
- [ ] Implement monthly budget reset logic
- [ ] Build category overview page

**Deliverable**: Users can set budgets and see spending vs budget

---

### Phase 4: Dashboard & Visualizations (Week 4)
**Goal**: Create main dashboard with data visualization

**Tasks**:
- [ ] Set up chart library (Recharts or Tremor)
- [ ] Create summary cards (income, expenses, balance)
- [ ] Build spending by category pie chart
- [ ] Create income vs expenses trend chart
- [ ] Add recent transactions widget
- [ ] Implement budget status overview
- [ ] Add date range selector (current month, last month, etc.)
- [ ] Optimize data queries for dashboard

**Deliverable**: Functional dashboard showing financial overview

---

### Phase 5: Reports & Polish (Week 5)
**Goal**: Add reporting and polish the UI/UX

**Tasks**:
- [ ] Create monthly report page
- [ ] Implement CSV export functionality
- [ ] Add data filtering for reports
- [ ] Refine UI/UX based on testing
- [ ] Add loading states and error handling
- [ ] Implement responsive design improvements
- [ ] Add helpful tooltips and guidance
- [ ] Write user documentation
- [ ] Performance optimization

**Deliverable**: Complete MVP with reporting and polished UI

---

### Phase 6: Testing & Deployment (Week 6)
**Goal**: Test thoroughly and deploy to production

**Tasks**:
- [ ] Comprehensive manual testing
- [ ] Fix bugs and edge cases
- [ ] Test on different devices/browsers
- [ ] Set up production database
- [ ] Configure environment variables for production
- [ ] Deploy to Vercel (or chosen platform)
- [ ] Set up custom domain (optional)
- [ ] Create onboarding flow for new users
- [ ] Monitor for errors after launch

**Deliverable**: Live, production-ready MVP

---

## Recommended Tech Stack for MVP

**SELECTED STACK** ✅

### Core Stack
- **Framework**: Next.js 16 ✅
- **Language**: TypeScript ✅
- **Styling**: Tailwind CSS 4 ✅

### Additional Tools (Installed)
- **Database**: PostgreSQL + Prisma ORM ✅
- **Authentication**: NextAuth.js v5 (Auth.js) ✅
- **UI Components**: shadcn/ui (to be added)
- **Forms**: React Hook Form + Zod validation ✅
- **Charts**: Recharts or Tremor (to be added)
- **State Management**: Zustand + TanStack Query (to be added)
- **Date Handling**: date-fns (to be added)
- **Icons**: Lucide React (to be added)
- **Notifications**: Sonner (to be added)
- **Deployment**: Vercel

---

## Database Schema (MVP)

### Users Table
```
- id (uuid, primary key)
- email (string, unique)
- name (string)
- created_at (timestamp)
- updated_at (timestamp)
```

### Categories Table
```
- id (uuid, primary key)
- name (string)
- icon (string, optional)
- color (string, optional)
- is_default (boolean)
- created_at (timestamp)
```

### Budgets Table
```
- id (uuid, primary key)
- user_id (uuid, foreign key)
- category_id (uuid, foreign key)
- amount (decimal)
- month (integer, 1-12)
- year (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### Transactions Table
```
- id (uuid, primary key)
- user_id (uuid, foreign key)
- category_id (uuid, foreign key)
- amount (decimal)
- type (enum: 'income' | 'expense')
- description (text, optional)
- date (date)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Timeline

**Estimated MVP Completion**: 6 weeks (part-time) or 3 weeks (full-time)

### Weekly Breakdown:
- **Week 1**: Foundation & Setup
- **Week 2**: Transaction Management
- **Week 3**: Categories & Budgets
- **Week 4**: Dashboard & Charts
- **Week 5**: Reports & Polish
- **Week 6**: Testing & Deployment

---

## Success Metrics for MVP

The MVP will be considered successful when:

✅ User can create an account and sign in securely  
✅ User can add/edit/delete income and expense transactions  
✅ User can set monthly budgets for categories  
✅ Dashboard displays accurate financial summary  
✅ User can see spending vs budget per category  
✅ Charts visualize spending patterns  
✅ User can filter and export transaction data  
✅ App is responsive and works on mobile  
✅ App is deployed and accessible online  

---

## Next Immediate Steps

1. **Choose your database**: Supabase (easiest) or Prisma + PostgreSQL?
2. **Choose authentication**: Clerk (fastest) or NextAuth.js?
3. **Install dependencies** for chosen stack
4. **Set up database schema** and models
5. **Create authentication flow**
6. **Begin Phase 1 implementation**

Would you like me to help you get started with any of these steps?

---

_Last Updated: December 3, 2025_
