const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb+srv://smitmpatel0603:Smit0610@cluster0.5jtwcma.mongodb.net/splittrack?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

/* ---------------------- EXPENSE SCHEMA ---------------------- */
const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  uid: String,
  category: { type: String, default: 'Other' },
});

const Expense = mongoose.model('Expense', ExpenseSchema);

/* ---------------------- GROUP SCHEMAS ---------------------- */
const GroupSchema = new mongoose.Schema({
  name: String,
  members: [
    {
      email: String,
      nickname: String,
    },
  ],
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model('Group', GroupSchema);

const GroupExpenseSchema = new mongoose.Schema({
  groupId: String,
  description: String,
  amount: Number,
  paidBy: String,
  splitBetween: [String],
  date: { type: Date, default: Date.now },
});
const GroupExpense = mongoose.model('GroupExpense', GroupExpenseSchema);

/* ---------------------- ROUTES ---------------------- */

// ✅ Home
app.get('/', (req, res) => {
  res.send('🎉 SplitTrack Backend is Live!');
});

/* ---------- EXPENSE ROUTES ---------- */

// ✅ POST: Add Personal Expense
app.post('/expenses', async (req, res) => {
  const { description, amount, date, uid, category } = req.body;

  if (!uid) return res.status(400).json({ error: 'UID is required' });

  try {
    const newExpense = new Expense({ description, amount, date, uid, category });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

// ✅ GET: Get Expenses by User UID
app.get('/expenses', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'UID is required' });

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
  const { description, amount, date, category } = req.body;

  try {
    const updated = await Expense.findByIdAndUpdate(
      id,
      { description, amount, date, category },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// ✅ DELETE: Delete Expense
app.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

/* ---------- GROUP ROUTES ---------- */

/// ✅ POST: Create Group with Nicknames
app.post('/groups', async (req, res) => {
  const { name, members, createdBy } = req.body;
  if (!name || !members || !createdBy) {
    return res.status(400).json({ error: 'Missing group fields' });
  }

  try {
    const group = new Group({ name, members, createdBy });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// ✅ GET: Groups for a user (by email match)
app.get('/groups', async (req, res) => {
  const { uid } = req.query;

  try {
    const groups = await Group.find({ 'members.email': uid });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});
/* ---------- GROUP EXPENSE ROUTES ---------- */

// ✅ POST: Add Group Expense
app.post('/group-expenses', async (req, res) => {
  const { groupId, description, amount, paidBy, splitBetween } = req.body;

  if (!groupId || !description || !amount || !paidBy || !splitBetween) {
    return res.status(400).json({ error: 'Missing expense fields' });
  }

  try {
    const expense = new GroupExpense({
      groupId,
      description,
      amount,
      paidBy,
      splitBetween,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save group expense' });
  }
});

// ✅ GET: Expenses by Group ID
app.get('/group-expenses', async (req, res) => {
  const { groupId } = req.query;
  if (!groupId) return res.status(400).json({ error: 'Group ID is required' });

  try {
    const expenses = await GroupExpense.find({ groupId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group expenses' });
  }
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
