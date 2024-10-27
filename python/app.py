from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from geocode import geocode_address  # Ensure this is an importable function
import logging

# Database setup
disaster_database = "disaster_detail.db"
with sqlite3.connect(disaster_database) as conn:
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS disaster_data (
        address TEXT,
        long INT,
        lat INT,
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
def add_data(address, longitude, latitude, category, status, description):
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO disaster_data (address, long, lat, category, status, description)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (address, longitude, latitude, category, status, description))
        conn.commit()
    return True

# Route to handle reporting a disaster
@app.route("/reportSubmit", methods=["POST", "GET"])
def handle_report():
    if request.method == "POST":
        data = request.get_json()
        
        #might need error checking
        category = data.get("category")
        address = data.get("address")
        status = data.get("status")
        description = data.get("description")

        address_json = {"address": address}
        #print(address_json)
        result=(handle_geocode(address_json))

        # Debugging line to print the result of geocoding
        #print("Geocode result:", result)

        # Check if geocoding was successful
        if not result:
            logging.error("Geocoding failed. The result is None.")
            return jsonify({"error": "Could not geocode the provided address"}), 400

        lat = result.get("latitude")
        long = result.get("longitude")

        add_data(address, long, lat, category, status, description)

        return jsonify({"message": "Disaster report added successfully"}), 201


    elif request.method == "GET":
        category = request.args.get("category")
        query = "SELECT * FROM disaster_data"
        if category:
            query += f" WHERE category = '{category}'"
            
        with sqlite3.connect(disaster_database) as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()

        reports = [] #reports list

        for i in rows:
            reports.append({
                "address": i[0],
                "longitude": i[1],
                "latitude": i[2],
                "category": i[3],
                "status": i[4],
                "description": i[5]
            })
        return jsonify(reports), 200

# Helper function to handle geocoding
def handle_geocode(data):
    if not data or "address" not in data:
        return None

    address = data.get("address")
    result = geocode_address(address)
    return result


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
