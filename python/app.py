from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from geocode import geocode_address  # Ensure this is an importable function

# Database setup
disaster_database = "disaster_detail.db"
with sqlite3.connect(disaster_database) as conn:
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS disaster_data (
        long REAL,
        lat REAL,
        category TEXT,
        status TEXT,
        description TEXT
    )
    ''')
    conn.commit()

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Utility function to add disaster data to the database
def add_data(longitude, latitude, category, status, description):
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO disaster_data (long, lat, category, status, description)
            VALUES (?, ?, ?, ?, ?)
        ''', (longitude, latitude, category, status, description))
        conn.commit()
    return True

# Route to handle reporting a disaster
@app.route("/reportSubmit", methods=["POST"])
def handle_report():
    data = request.get_json()
    
    # Extract fields and validate data
    category = data.get("category")
    address = data.get("address")
    status = data.get("status")
    description = data.get("description")

    if not category or not address or not status or not description:
        return jsonify({"error": "All fields are required"}), 400

    # Geocode the address
    address_json = {"address": address}
    result = handle_geocode(address_json)
    if not result:
        return jsonify({"error": "Geocoding failed"}), 400
    
    lat, long = result
    add_data(long, lat, category, status, description)
    return jsonify({"message": "Disaster report added successfully"}), 201

# Helper function to handle geocoding
def handle_geocode(data):
    if not data or "address" not in data:
        return None

    address = data.get("address")
    result = geocode_address(address)
    
    # Ensure result contains latitude and longitude
    if isinstance(result, tuple):
        return result
    return None

# Sample disaster locations (static data)
locations = [
    {"id": 1, "lat": 37.7749, "lng": -122.4194},
    {"id": 2, "lat": 34.0522, "lng": -118.2437},
    {"id": 3, "lat": 40.7128, "lng": -74.0060},
]
# Route to get sample disaster locations
@app.route('/api/locations', methods=['GET'])
def get_locations():
    # API endpoint to get location data
    return jsonify(locations)

if __name__ == '__main__':
    app.run(debug=True)
