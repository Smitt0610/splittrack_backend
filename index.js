const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb+srv://smitmpatel0603:Smit0610@cluster0.5jtwcma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Expense Schema
const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  uid: String, // 🔐 Store Firebase UID to associate expense with a user
});

const Expense = mongoose.model('Expense', ExpenseSchema);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('🎉 SplitTrack Backend is Live!');
});

// ✅ POST: Add Expense
app.post('/expenses', async (req, res) => {
  const { description, amount, date, uid } = req.body;

  console.log("✅ UID received from frontend:", uid); // Debug log

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    const newExpense = new Expense({ description, amount, date, uid });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("❌ Failed to save expense:", error);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

// ✅ GET: Fetch Expenses by UID
app.get('/expenses', async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'UID is required to fetch expenses' });
  }

  try {
    const expenses = await Expense.find({ uid }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("❌ Failed to fetch expenses:", error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// ✅ Start Server on dynamic port (Render requirement)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
