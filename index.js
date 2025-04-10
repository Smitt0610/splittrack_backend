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
});

const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

const Expense = mongoose.model('Expense', ExpenseSchema);

// ✅ Routes
app.get('/expenses', async (req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
});

app.post('/expenses', async (req, res) => {
  const { description, amount } = req.body;
  const newExpense = new Expense({ description, amount });
  await newExpense.save();
  res.status(201).json(newExpense);
});

app.listen(4000, () => {
  console.log('🚀 Backend running at http://localhost:4000');
});
