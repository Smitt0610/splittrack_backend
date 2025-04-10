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

// ✅ Schema
const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String, // ✅ New field for charting
  date: { type: Date, default: Date.now },
  uid: String,
  category: {type: String, default: 'Other'},
});

const Expense = mongoose.model('Expense', ExpenseSchema);

// ✅ Routes

app.get('/', (req, res) => {
  res.send('🎉 SplitTrack Backend is Live!');
});

// ✅ POST: Add Expense
app.post('/expenses', async (req, res) => {
  const { description, amount, date, uid, category } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    const newExpense = new Expense({ description, amount, date, uid, category });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save expense' });
  }
});


// ✅ GET: Fetch Expenses by UID
app.get('/expenses', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'UID is required to fetch expenses' });

  try {
    const expenses = await Expense.find({ uid }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// ✅ PATCH: Edit Expense
app.patch('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, date } = req.body;

  try {
    const updated = await Expense.findByIdAndUpdate(
      id,
      { description, amount, date },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// ✅ DELETE: Remove Expense
app.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
