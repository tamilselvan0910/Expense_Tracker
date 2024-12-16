import React, { useEffect, useState } from 'react';
import ExpenseList from './ExpenseList';  // Import ExpenseList component
import ExpenseSummary from './ExpenseSummary';  // Import ExpenseSummary component
import AddExpenses from "./Addexpenses";

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total_amount: 0, category_summary: {} });

  // Fetch expenses data from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-expenses')
      .then(response => response.json())
      .then(data => setExpenses(data.expenses))
      .catch(error => console.log(error));
  }, []);

  // Fetch expense summary data from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-expense-summary')
      .then(response => response.json())
      .then(data => setSummary(data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h1>Expense Tracker</h1>
      <AddExpenses/>
      <ExpenseSummary summary={summary} /> {/* Pass the summary data as props */}
      <ExpenseList expenses={expenses} /> {/* Pass the expenses data as props */}
    </div>
  );
};

export default Home;
