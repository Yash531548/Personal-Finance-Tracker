# 💰 Personal Finance Visualizer

A beautiful, full-featured personal finance tracking application built with Next.js, MongoDB, and modern web technologies. Track your income, expenses, set budgets, and gain insights into your spending patterns with stunning visualizations.

![Personal Finance Visualizer](https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 📊 **Transaction Management**
- ✅ Add, edit, and delete transactions
- ✅ Categorize income and expenses
- ✅ Date-based transaction tracking
- ✅ Search and filter transactions
- ✅ Sort by date or amount

### 📈 **Visual Analytics**
- ✅ Monthly expenses bar chart
- ✅ Category-wise pie chart breakdown
- ✅ Budget vs actual comparison charts
- ✅ Spending trend analysis

### 🎯 **Budget Management**
- ✅ Set monthly category budgets
- ✅ Real-time budget tracking
- ✅ Over-budget alerts
- ✅ Budget performance insights

### 🧠 **Smart Insights**
- ✅ AI-powered spending analysis
- ✅ Monthly comparison trends
- ✅ Spending projections
- ✅ Personalized recommendations

### 🎨 **Beautiful UI/UX**
- ✅ Modern, responsive design
- ✅ Apple-level design aesthetics
- ✅ Smooth animations and transitions
- ✅ Intuitive user interface
- ✅ Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/personal-finance
   
   # For MongoDB Atlas (alternative)
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance
   ```

4. **Start MongoDB**
   
   **Local MongoDB:**
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```
   
   **Or use MongoDB Atlas** (cloud database) - just update the connection string in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Adding Transactions

1. Navigate to the **Transactions** tab
2. Click **"Add Transaction"**
3. Fill in the details:
   - **Type**: Income or Expense
   - **Amount**: Transaction amount
   - **Description**: Brief description
   - **Date**: Transaction date
   - **Category**: Select from predefined categories
4. Click **"Add Transaction"**

### Setting Budgets

1. Go to the **Budgets** tab
2. Click **"Set Budget"**
3. Choose a category and set monthly limit
4. Track your progress in real-time

### Viewing Analytics

1. **Overview Tab**: See all charts and insights
2. **Monthly Expenses**: Bar chart showing spending trends
3. **Category Breakdown**: Pie chart of expense distribution
4. **Budget Comparison**: Track budget vs actual spending
5. **Smart Insights**: AI-powered spending analysis

## 🏗️ Project Structure

```
personal-finance-visualizer/
├── app/                          # Next.js 13 app directory
│   ├── api/                      # API routes
│   │   ├── transactions/         # Transaction CRUD endpoints
│   │   └── budgets/              # Budget CRUD endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── finance/                  # Finance-specific components
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── TransactionForm.tsx   # Transaction form
│   │   ├── TransactionList.tsx   # Transaction list
│   │   ├── BudgetForm.tsx        # Budget form
│   │   ├── BudgetList.tsx        # Budget list
│   │   ├── MonthlyExpensesChart.tsx
│   │   ├── CategoryPieChart.tsx
│   │   ├── BudgetComparisonChart.tsx
│   │   └── SpendingInsights.tsx
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility libraries
│   ├── api.ts                    # API client functions
│   ├── mongodb.ts                # MongoDB connection
│   └── utils.ts                  # Utility functions
├── models/                       # MongoDB models
│   ├── Transaction.ts            # Transaction schema
│   └── Budget.ts                 # Budget schema
├── types/                        # TypeScript type definitions
│   └── finance.ts                # Finance-related types
└── public/                       # Static assets
```

## 🎨 Design Philosophy

This application follows **Apple-level design aesthetics** with:

- **Clean, minimalist interface**
- **Consistent spacing and typography**
- **Thoughtful color palette**
- **Smooth animations and micro-interactions**
- **Intuitive user experience**
- **Responsive design for all devices**

## 📊 Database Schema

### Transactions Collection
```javascript
{
  _id: ObjectId,
  amount: Number,
  description: String,
  date: String,
  type: "expense" | "income",
  category: String,
  createdAt: String
}
```

### Budgets Collection
```javascript
{
  _id: ObjectId,
  category: String (unique),
  monthlyLimit: Number,
  createdAt: String
}
```

## 🔧 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create/update budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy automatically**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Recharts** for stunning data visualizations
- **MongoDB** for reliable data persistence
- **Next.js** for the amazing React framework
- **Tailwind CSS** for utility-first styling

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](../../issues) page
2. Create a new issue if needed
3. Reach out to the maintainers

---

**Built with ❤️ using Next.js, MongoDB, and modern web technologies**

*Happy budgeting! 💰*