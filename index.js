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

// ✅ GET: Get Single Group by ID
app.get('/groups/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// ✅ Add this to your existing backend (index.js)

// ✅ Calculate balances within a group (with nicknames)
app.get('/group-balances/:groupId', async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const nicknameMap = {};
    group.members.forEach(member => {
      nicknameMap[member.email] = member.nickname;
    });

    const expenses = await GroupExpense.find({ groupId });
    const balances = {};

    for (let expense of expenses) {
      const amountPerUser = expense.amount / expense.splitBetween.length;

      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;

      for (let member of expense.splitBetween) {
        balances[member] = (balances[member] || 0) - amountPerUser;
      }
    }

    const formatted = {};
    for (let email in balances) {
      const nickname = nicknameMap[email] || email;
      formatted[nickname] = parseFloat(balances[email].toFixed(2));
    }

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate balances' });
  }
});

// ✅ Updated backend logic for /total-balance endpoint

app.get('/total-balance', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'UID required' });

  try {
    const groupExpenses = await GroupExpense.find({
      $or: [
        { paidBy: uid },
        { splitBetween: uid },
      ],
    });

    let balanceMap = {};

    groupExpenses.forEach((expense) => {
      const share = expense.amount / expense.splitBetween.length;

      expense.splitBetween.forEach(member => {
        if (member === expense.paidBy) return; // Skip payer for now

        if (uid === expense.paidBy) {
          // You paid, others owe you
          balanceMap[member] = (balanceMap[member] || 0) + share;
        } else if (member === uid) {
          // Someone else paid, you owe
          balanceMap[expense.paidBy] = (balanceMap[expense.paidBy] || 0) - share;
        }
      });
    });

    const youOwe = Object.values(balanceMap).filter(v => v < 0).reduce((a, b) => a + b, 0);
    const youAreOwed = Object.values(balanceMap).filter(v => v > 0).reduce((a, b) => a + b, 0);

    const breakdown = {};
    for (const [key, value] of Object.entries(balanceMap)) {
      const group = await Group.findOne({ members: { $elemMatch: { email: key } } });
      const nickname = group?.members?.find(m => m.email === key)?.nickname || key;
      breakdown[nickname] = value;
    }

    res.json({ totalOwe: Math.abs(youOwe), totalOwed: youAreOwed, breakdown });
  } catch (error) {
    console.error('Error in /total-balance:', error);
    res.status(500).json({ error: 'Failed to calculate balance' });
  }
});
