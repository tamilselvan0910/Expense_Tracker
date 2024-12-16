import React, { useEffect, useState } from 'react';

const AddExpenses = () => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState([]);
  const [editId, setEditId] = useState(null); // To track the expense being edited
  const [loading, setLoading] = useState(true);

  // Fetch expenses on component mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get-expenses')
      .then((response) => response.json())
      .then((data) => {
        setResult(data.expenses);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching expenses:', error));
  }, []);

  // Add a new expense
  function handleData() {
    if (amount.trim() && date.trim() && category.trim() && description.trim()) {
      fetch('http://127.0.0.1:5000/add-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
          amount: amount.trim(),
          date: date.trim(),
          category: category.trim(),
          description: description.trim(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setResult([...result, data.expense]);
          clearForm();
          alert(data.message);
        })
        .catch((error) => console.error('Error adding expense:', error));
    } else {
      alert('Please fill in all fields.');
    }
  }

  // Update an existing expense
  function updateExpense() {
    if (!amount.trim() || !date.trim() || !category.trim() || !description.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    fetch(`http://127.0.0.1:5000/update-expense/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({
        amount: amount.trim(),
        date: date.trim(),
        category: category.trim(),
        description: description.trim(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(
          result.map((expense) =>
            expense.id === editId
              ? { ...expense, amount, date, category, description }
              : expense
          )
        );
        clearForm();
        setEditId(null);
        alert(data.message);
      })
      .catch((error) => console.error('Error updating expense:', error));
  }

  // Delete an expense
  function deleteExpense(id) {
    fetch(`http://127.0.0.1:5000/delete-expense/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setResult(result.filter((expense) => expense.id !== id));
        alert('Expense deleted successfully.');
      })
      .catch((error) => console.error('Error deleting expense:', error));
  }

  // Clear the form inputs
  function clearForm() {
    setAmount('');
    setDate('');
    setCategory('');
    setDescription('');
  }

  return (
    <div>
      <h1>{editId ? 'Update Expense' : 'Add Expense'}</h1>
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
      <button onClick={editId ? updateExpense : handleData}>
        {editId ? 'Update' : 'Add'}
      </button>

      <div>
        <h2>Expenses</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.amount}</td>
                  <td>{expense.date}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditId(expense.id);
                        setAmount(expense.amount);
                        setDate(expense.date);
                        setCategory(expense.category);
                        setDescription(expense.description);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteExpense(expense.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AddExpenses;
