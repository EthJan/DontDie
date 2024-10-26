from flask import Flask, jsonify, request, url_for, redirect, json
from geocode import geocode_address
from flask_cors import CORS
import sqlite3

disaster_database = "disaster_detail.db"
with sqlite3.connect(disaster_database) as conn:
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS disaster_data (
        long INT,
        lat INT,
        category TEXT,
        status TEXT,
        description TEXT
    )
    ''')
    conn.commit()

app = Flask(__name__)
CORS(app)

def add_data(longitude, latitude, category, status, description):
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO disaster_data (long, lat, category, status, description)
            VALUES (?, ?, ?, ?, ?)
        ''', (longitude, latitude, category, status, description))
        conn.commit()
    return True



@app.route("/reportSubmit", methods=["GET", "POST"])
def handle_report():
    data = request.get_json()
    
    #might need error checking
    category = data.get("category")
    address = data.get("address")
    status = data.get("status")
    description = data.get("description")

    address_json = {"address": address}
    result = handle_geocode(address_json)
    lat = result.get("latitude")
    long = result.get("longitude")
    add_data(long, lat, category, status, description)

    return jsonify({"message": "Disaster report added successfully"}), 201

def handle_geocode(data):
    
    #error checking
    if not data or "address" not in data:
        return jsonify({"error": "Address is required"}), 400

    address = data.get("address")

    result = geocode_address(address)
    
    #check if address has a valid lat & long
    if isinstance(result, tuple):
        return result 

    #return geocode result
    return (result)

