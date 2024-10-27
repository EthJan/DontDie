from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from geocode import geocode_address  # Ensure this is an importable function
import math

disaster_database = "disaster_detail.db"
with sqlite3.connect(disaster_database) as conn:
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS disaster_data (
        address TEXT,
        d_long REAL,
        d_lat REAL,
        category TEXT,
        status TEXT,
        description TEXT
    )
    ''')
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS volunteer_data (
        name TEXT,
        phone INT,
        email TEXT,
        v_long REAL,
        v_lat REAL
    )
    ''')
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS organization_data (
        name TEXT,
        website TEXT,
        o_long REAL,
        o_lat REAL,
        radius REAL
    )
    ''')#add radius code later
    conn.commit()

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Utility function to add disaster data to the database
def add_data(address, longitude, latitude, category, status, description):
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO disaster_data (address, d_long, d_lat, category, status, description)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (address, longitude, latitude, category, status, description))
        conn.commit()
    return True

#add data into the volunteer table:
def add_volunteer_data(name_, phone_, email_, longitude_, latitude_):
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO volunteer_data (name, phone, email, v_long, v_lat)
            VALUES (?, ?, ?, ?, ?)
        ''', (name_, phone_, email_, longitude_, latitude_))
        conn.commit()
    return True

#add data into the organization table:
def add_organization_data(name_, radius_, website_, longitude_, latitude_):
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO organization_data (name, website, o_long, o_lat, radius)
            VALUES (?, ?, ?, ?, ?)
        ''', (name_, website_, longitude_, latitude_, radius_))
        conn.commit()
    return True

@app.route("/organizationSubmit", methods=["GET", "POST"])
def handle_organization():
    org_data = request.get_json()
    
    #might need error checking
    name = org_data.get("name")
    address = org_data.get("address")
    website = org_data.get("website")
    radius = org_data.get("radius")

    address_json = {"address": address}
    result = handle_geocode(address_json)
    olat = result.get("latitude")
    olong = result.get("longitude")
    add_organization_data(name, radius, website, olong, olat)

    return jsonify({"message": "Organization added successfully"}), 201

# Handle multiple organizations submission
@app.route("/batchOrganizationSubmit", methods=["POST"])
def batch_organization_submit():
    organizations = request.get_json()  # Expecting a list of organization dictionaries
    if not isinstance(organizations, list):
        return jsonify({"error": "Input should be a list of organization objects"}), 400

    count = 0  # Counter for successfully added organizations

    for org in organizations:
        # Extract organization data
        name = org.get("name")
        address = org.get("address")
        website = org.get("website")
        radius = org.get("radius")

        # Validate required fields
        if not (name and address and website and radius):
            return jsonify({"error": "Missing fields for one or more organizations"}), 400

        # Geocode the address to get latitude and longitude
        address_json = {"address": address}
        result = handle_geocode(address_json)
        olat = result.get("latitude")
        olong = result.get("longitude")

        # Add organization data to the database
        add_organization_data(name, radius, website, olong, olat)
        count += 1  # Increment the counter for each successful addition

    return jsonify({"message": f"{count} Organizations added successfully"}), 201

def haversine_distance(lat1, lng1, lat2, lng2):
    # Calculate the great-circle distance between two points on the Earth
    R = 6371  # Earth radius in kilometers

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)

    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)

    a = math.sin(delta_phi / 2) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2) ** 2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c  # Distance in kilometers

def match_volunteer_to_organizations(volunteer_lat, volunteer_lng):
    matched_orgs = []
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT name, website, o_long, o_lat, radius FROM organization_data')
        organizations = cursor.fetchall()

        for org in organizations:
            name, website, org_lng, org_lat, org_radius = org
            distance = haversine_distance(volunteer_lat, volunteer_lng, org_lat, org_lng)
            if distance <= org_radius:
                matched_orgs.append({
                    "name": name,
                    "website": website,
                    "o_long": org_lng,
                    "o_lat": org_lat,
                    "radius": org_radius,
                    "distance_km": round(distance, 2)
                })

    return matched_orgs

@app.route("/volunteerSubmit", methods=["GET", "POST"])
def handle_volunteer():
    volunteer_data = request.get_json()
    
    #might need error checking
    name = volunteer_data.get("name")
    address = volunteer_data.get("address")
    phone = volunteer_data.get("phone")
    email = volunteer_data.get("email")

    address_json = {"address": address}
    result = handle_geocode(address_json)
    v_lat = result.get("latitude")
    v_long = result.get("longitude")
    add_volunteer_data(name, phone, email, v_long, v_lat)

    # Match volunteer with organizations using the revised function
    matched_organizations = match_volunteer_to_organizations(v_lat, v_long)

    # Return the matched organizations to the frontend
    return jsonify({
        "message": "Personal info entered successfully",
        "volunteer_location": {"lat": v_lat, "lng": v_long},
        "matched_organizations": matched_organizations
    }), 201

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
        result=(handle_geocode(address_json))

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
        return reports, 200

@app.route("/batchReportSubmit", methods=["POST"])
def batch_report_submit():
    reports = request.get_json()  # Expecting a list of report dictionaries
    if not isinstance(reports, list):
        return jsonify({"error": "Input should be a list of report objects"}), 400

    count = 0  # Counter for successfully added reports

    for report in reports:
        # Extract report data
        category = report.get("category")
        address = report.get("address")
        status = report.get("status")
        description = report.get("description")

        # Validate required fields
        if not (category and address and status and description):
            return jsonify({"error": "Missing fields for one or more reports"}), 400

        # Geocode the address to get latitude and longitude
        address_json = {"address": address}
        result = handle_geocode(address_json)
        lat = result.get("latitude")
        long = result.get("longitude")

        # Add report data to the database
        add_data(long, lat, category, status, description)
        count += 1  # Increment the counter for each successful addition

    return jsonify({"message": f"{count} Disaster reports added successfully"}), 201

# Helper function to handle geocoding
def handle_geocode(data):
    if not data or "address" not in data:
        return None

    address = data.get("address")
    result = geocode_address(address)
    return result


# New route to get disaster reports from the database
@app.route('/api/reports', methods=['GET'])
def get_reports():
    # Retrieve data from the disaster_data table
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT address, d_long, d_lat, category, status, description FROM disaster_data")
        rows = cursor.fetchall()

    # Convert rows into JSON format
    reports = []
    for row in rows:
        reports.append({
            "address": row[0],
            "longitude": row[1],
            "latitude": row[2],
            "category": row[3],
            "status": row[4],
            "description": row[5]
        })

    # Return JSON response
    return jsonify(reports)

@app.route('/api/organizations', methods=['GET'])
def get_organizations():
    with sqlite3.connect(disaster_database) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name, website, o_long, o_lat, radius FROM organization_data")
        rows = cursor.fetchall()

        organizations = []
        for row in rows:
            organizations.append({
                "name": row[0],
                "website": row[1],
                "longitude": row[2],
                "latitude": row[3],
                "radius": row[4]
            })

    return jsonify(organizations)


if __name__ == '__main__':
    app.run(debug=True)
