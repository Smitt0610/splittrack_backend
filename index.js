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
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Expense Schema with UID
const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  uid: String,
});

const Expense = mongoose.model('Expense', ExpenseSchema);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('🎉 SplitTrack Backend is Live!');
});

// ✅ Get Expenses for a Specific User
app.get('/expenses', async (req, res) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const expenses = await Expense.find({ uid }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('❌ Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// ✅ Add Expense with UID
app.post('/expenses', async (req, res) => {
    const { description, amount, date, uid } = req.body;
  
    if (!uid) {
      return res.status(400).json({ error: 'User ID required' });
    }
  
    try {
      const newExpense = new Expense({ description, amount, date, uid });
      await newExpense.save();
      res.status(201).json(newExpense);
    } catch (err) {
      console.error("❌ Error saving expense:", err);
      res.status(400).json({ error: 'Failed to save expense' });
    }
  });
  

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
