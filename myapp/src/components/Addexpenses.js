import React, { useEffect, useState } from 'react';

const AddExpenses = () => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState([]);

  // Fetch data from the backend on component mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-expenses')  // Fetching all expenses
      .then((response) => response.json())
      .then((data) => setResult(data.expenses))
      .catch((error) => console.error('Error fetching expenses:', error));
  }, []);

  // Handle form submission to add a new expense
  function handleData() {
    if (amount.trim() && date.trim() && category.trim() && description.trim()) {
      fetch('http://127.0.0.1:5000/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          amount: amount.trim(),
          date: date.trim(),
          category: category.trim(),
          description: description.trim(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          setResult([...result, data.expense]);  // Update the state with the new expense
        })
        .catch((error) => console.error('Error adding expense:', error));
    } else {
      alert('Please fill in all fields.');
    }
  }

  return (
    <div>
      <h1>Add Expense</h1>
      <label>Amount</label>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <label>Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <label>Category</label>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <label>Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleData}>Add</button>

      <div>
        <h2>Expenses</h2>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {result.map((res) => (
              <tr key={res.id}>
                <td>{res.amount}</td>
                <td>{res.date}</td>
                <td>{res.category}</td>
                <td>{res.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddExpenses;
