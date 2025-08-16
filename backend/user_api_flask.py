from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import mysql.connector
import bcrypt


app = Flask(__name__)
CORS(app)

@app.route('/user-dashboard/custom-recommend', methods=['POST'])
def custom_recommend():
    data = request.json

    name = data.get('name', '').strip().title()
    age = int(data.get('age', 0))
    gender = data.get('gender', '').strip().lower()
    occupation = data.get('occupation', '').strip().lower()
    district = data.get('district', '').strip().title()
    pincode = str(data.get('pincode', '')).strip()

    schemes = []

    # 💡 Scheme Recommendation
    if occupation == "farmer":
        schemes.append("🚜 PM-KISAN Yojana")
        if age < 40:
            schemes.append("💳 Farmer Credit Scheme")
    elif occupation == "student":
        if gender == "female" and age <= 25:
            schemes.append("📚 Sukanya Samriddhi (for girls)")
        schemes.append("🎓 National Scholarship Scheme")
    elif occupation == "business":
        schemes.append("🏢 MSME Loan")
    elif occupation == "retired" and age > 60:
        schemes.append("👴 Pension Scheme")
    elif occupation == "government employee":
        schemes.append("🏛️ Postal Life Insurance (PLI)")
        schemes.append("🪙 General Provident Fund (GPF)")
    elif occupation == "housewife":
        schemes.append("👩‍🍳 Mahila Samman")
    elif occupation == "unemployed":
        schemes.append("🆘 PM Jan Dhan Yojana")
    elif occupation == "private employee":
        schemes.append("💼 Term Insurance")

    # Add for all females
    if gender == "female" and "👩‍🍳 Mahila Samman" not in schemes:
        schemes.append("👩‍👧‍👦 Mahila Samman Savings Certificate")

    # 📍 Nearby Post Offices via PINCODE
    offices = []
    try:
        if not pincode or len(pincode) != 6 or not pincode.isdigit():
            offices.append("⚠️ Invalid or missing pincode.")
        else:
            url = f"https://api.postalpincode.in/pincode/{pincode}"
            print(f"📡 Fetching post office data from: {url}")  # debug log
            response = requests.get(
                url,
                headers={"User-Agent": "Mozilla/5.0"},
                timeout=5
            )
            response.raise_for_status()
            post_data = response.json()
            print("✅ API Response:", post_data)  # debug log

            if post_data[0]['Status'] == 'Success':
                for po in post_data[0]['PostOffice']:
                    full_address = (
                        f"{po['Name']} ({po['BranchType']} Branch), "
                        f"{po['Division']}, {po['District']}, "
                        f"{po['State']} - {po['Pincode']}"
                    )
                    offices.append(full_address)
            else:
                offices.append("⚠️ No post offices found for this pincode.")
    except Exception as e:
        print("❌ Error fetching post office data:", e)
        offices.append(f"❌ Error fetching post office data: {str(e)}")

    return jsonify({
        "user": {
            "name": name,
            "age": age,
            "gender": gender.capitalize(),
            "occupation": occupation.title(),
            "district": district,
            "pincode": pincode
        },
        "recommended_schemes": schemes,
        "nearby_post_offices": offices
    })


# ---------------- MySQL Setup ----------------
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Bala@priyan@123",  # ✅ Change this in production
    database="recommendationdb"
)
cursor = conn.cursor(dictionary=True)


# ---------------- Signup API ----------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    full_name = data.get('full_name')
    phone = data.get('phone')
    role = data.get('role')
    post_office_code = data.get('post_office_code')
    address = data.get('address')

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({'success': False, 'message': 'Email already registered'}), 409

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cursor.execute("""
        INSERT INTO users (email, password, username, full_name, phone, role, post_office_code, address)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (email, hashed_pw.decode('utf-8'), username, full_name, phone, role, post_office_code, address))
    conn.commit()

    return jsonify({'success': True, 'message': 'Account created successfully'}), 201


# ---------------- Login API ----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'email': user['email'],
            'role': user['role']
        }), 200
    else:
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(port=5002, debug=True)
