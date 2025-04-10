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

// ✅ Schema
const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  uid: String, // ✅ This is the important part!
});

const Expense = mongoose.model('Expense', ExpenseSchema);

// ✅ POST: Save Expense
app.post('/expenses', async (req, res) => {
  const { description, amount, date, uid } = req.body;

  console.log("✅ RECEIVED UID:", uid); // <-- Debug line

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    const newExpense = new Expense({ description, amount, date, uid });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("❌ Save failed:", error);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});
