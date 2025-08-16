from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
# app.pyThis imports the FastAPI app instance from user_api.py


app = Flask(__name__)
CORS(app)

# Load the Excel file from the 'excel' directory

df = pd.read_excel("excel/india-districts-census-2011 edit.xlsx", engine='openpyxl')


# Clean column names
df.columns = df.columns.str.strip().str.replace(' ', '_').str.replace(r'[^\w]', '', regex=True)

# Metrics calculator
def compute_metrics(district_row):
    population = district_row['Population']
    male = district_row['Male']
    female = district_row['Female']
    male_literate = district_row['Male_Literate']
    female_literate = district_row['Female_Literate']
    workers = district_row['Workers']
    cultivators = district_row['Cultivator_Workers']
    agri_labourers = district_row['Agricultural_Workers']
    rural = district_row['Rural_Households']
    total_households = district_row['Households']
    age_50 = district_row['Age_Group_50']
    age_ns = district_row['Age_not_stated']

    total_farmers = cultivators + agri_labourers
    farmer_percent = (total_farmers / workers) * 100 if workers > 0 else 0
    female_percent = (female / population) * 100
    male_percent = (male / population) * 100
    female_literacy = (female_literate / female) * 100 if female > 0 else 0
    male_literacy = (male_literate / male) * 100 if male > 0 else 0
    rural_percent = (rural / total_households) * 100 if total_households > 0 else 0
    senior_citizen_percent = ((age_50 + age_ns) / population) * 100 if population > 0 else 0

    income_cols = {
        "<₹90,000": int(district_row['Power_Parity_Less_than_Rs_45000'] + district_row['Power_Parity_Rs_45000_90000']),
        "₹90,000 - ₹1,50,000": int(district_row['Power_Parity_Rs_90000_150000']),
        "₹1,50,000 - ₹3,30,000": int(district_row['Power_Parity_Rs_150000_330000']),
        ">₹3,30,000": int(district_row['Power_Parity_Above_Rs_545000'])
    }

    avg_income_group = max(income_cols, key=income_cols.get)

    return {
        "female_percent": float(round(female_percent, 2)),
        "male_percent": float(round(male_percent, 2)),
        "female_literacy": float(round(female_literacy, 2)),
        "male_literacy": float(round(male_literacy, 2)),
        "farmer_percent": float(round(farmer_percent, 2)),
        "rural_percent": float(round(rural_percent, 2)),
        "senior_citizen_percent": float(round(senior_citizen_percent, 2)),
        "avg_income_group": str(avg_income_group),
        "income_distribution": {str(k): int(v) for k, v in income_cols.items()}
    }

# Scheme recommender with full names and emojis
def recommend_schemes(metrics):
    schemes = []

    if metrics['female_percent'] > 50 and metrics['female_literacy'] > 60:
        schemes.append("👧 Sukanya Samriddhi Account (SSA)")

    if metrics['senior_citizen_percent'] > 15:
        schemes.append("👴 Senior Citizen Savings Scheme (SCSS)")

    if metrics['farmer_percent'] > 30 and metrics['rural_percent'] > 60:
        schemes.append("🛡️ Rural Postal Life Insurance (RPLI)")

    if metrics['farmer_percent'] > 40:
        schemes.append("🌾 Kisan Vikas Patra (KVP)")

    if metrics['avg_income_group'] in ["<₹90,000", "₹90,000 - ₹1,50,000"]:
        schemes.append("📆 Recurring Deposit (RD), 🌳 Public Provident Fund (PPF), 📜 National Savings Certificate (NSC)")

    if metrics['female_percent'] > 50 and metrics['avg_income_group'] == "<₹90,000":
        schemes.append("👩 Mahila Samman Savings Certificate")

    return schemes

# API endpoint
@app.route('/recommend', methods=['POST'])
def recommend():
    district_name = request.json.get('district', '').strip().lower()
    row = df[df['District_name'].str.lower() == district_name]

    if not row.empty:
        district_row = row.iloc[0]
        metrics = compute_metrics(district_row)
        schemes = recommend_schemes(metrics)
        return jsonify({
            "district": str(district_row['District_name']),
            "metrics": metrics,
            "schemes": schemes
        })
    else:
        return jsonify({"error": "District not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
