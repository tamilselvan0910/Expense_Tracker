from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Your MySQL username
    password="root",  # Your MySQL password
    database="expense_tracker"  # The database name
)

cursor = db.cursor()

# Endpoint to login
@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    useremail = data.get("email")
    password = data.get("password")
    result = False
    cursor.execute("SELECT * FROM Login WHERE email=%s and password=%s", (useremail, password))
    user = cursor.fetchone()
    if user:
        result = True
    return jsonify({"result": result})

# Endpoint to register a user
@app.route("/register", methods=["POST"])
def register():
    regData = request.get_json()
    regemail = regData.get('email')
    regpass = regData.get('password')

    try:
        cursor.execute("INSERT INTO Login (email, password) VALUES (%s, %s)", (regemail, regpass))
        db.commit()
        cursor.execute("SELECT * FROM Login WHERE email=%s and password=%s", (regemail, regpass))
        regout = cursor.fetchone()
        return jsonify({
            "message": "Registration successful",
            "register": {
                "email": regout[0],
                "password": regout[1]
            }
        })
    except Exception as e:
        return jsonify({"message": f"Error in Registration: {str(e)}"}), 400

# Endpoint to add an expense
@app.route('/add-expense', methods=['POST'])
def add_expense():
    data = request.get_json()
    amount = data.get('amount')
    date = data.get('date')
    category = data.get('category')
    description = data.get('description')

    try:
        cursor.execute(
            "INSERT INTO expenses (amount, date, category, description) VALUES (%s, %s, %s, %s)",
            (amount, date, category, description)
        )
        db.commit()

        # Fetch the added expense to return
        cursor.execute("SELECT * FROM expenses WHERE id = LAST_INSERT_ID()")
        expense = cursor.fetchone()

        return jsonify({
            "message": "Expense added successfully!",
            "expense": {
                "id": expense[0],
                "amount": expense[1],
                "date": expense[2],
                "category": expense[3],
                "description": expense[4]
            }
        })
    except Exception as e:
        return jsonify({"message": f"Error adding expense: {str(e)}"}), 400

# Endpoint to get all expenses
@app.route('/get-expenses', methods=['GET'])
def get_expenses():
    cursor.execute("SELECT * FROM expenses")
    expenses = cursor.fetchall()

    result = []
    for expense in expenses:
        result.append({
            "id": expense[0],
            "amount": expense[1],
            "date": expense[2],
            "category": expense[3],
            "description": expense[4]
        })

    return jsonify({"expenses": result})

# Endpoint to get the expense summary
@app.route('/get-expense-summary', methods=['GET'])
def get_expense_summary():
    cursor.execute("SELECT * FROM expenses")
    expenses = cursor.fetchall()

    total_amount = 0
    category_summary = {}

    for expense in expenses:
        total_amount += float(expense[1])
        category = expense[3]
        if category in category_summary:
            category_summary[category] += float(expense[1])
        else:
            category_summary[category] = float(expense[1])

    return jsonify({
        "total_amount": total_amount,
        "category_summary": category_summary
    })

if __name__ == '__main__':
    app.run(debug=True)