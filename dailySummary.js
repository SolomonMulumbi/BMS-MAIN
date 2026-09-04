// dailySummary.js
const db = require("./firebase");

async function computeAndStoreDailySummary() {
  const today = new Date().toISOString().split("T")[0];
  const salesSnap = await db.ref("salesReceipts").once("value");
  const expenseSnap = await db.ref("daily_expenses").once("value");

  let gross = 0, expenses = 0;

  if (salesSnap.exists()) {
    const sales = salesSnap.val();
    for (const key in sales) {
      const sale = sales[key];
      const date = new Date(sale.timestamp).toISOString().split("T")[0];
      if (date === today) gross += parseFloat(sale.amountTendered || 0);
    }
  }

  if (expenseSnap.exists()) {
    const expensesToday = expenseSnap.val()[today] || {};
    for (const id in expensesToday) {
      const item = expensesToday[id];
      expenses += parseFloat(item.amount || 0);
    }
  }

  const net = gross - expenses;

  await db.ref(`daily_summaries/${today}`).set({
    grossIncome: gross,
    totalExpenses: expenses,
    netIncome: net,
    savedAt: new Date().toISOString()
  });

  console.log(`✅ Summary saved for ${today}`);
}

module.exports = computeAndStoreDailySummary;
