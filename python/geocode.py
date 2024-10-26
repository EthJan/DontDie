import requests
from flask import jsonify

GEOCODING_API_KEY = "AIzaSyCLHKPgYJjtjPOSWtq3XFbrcrE--5MTUUU"

def geocode_address(address):
    geocoding_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GEOCODING_API_KEY}"

    response = requests.get(geocoding_url)
    geocode_data = response.json()

    #check if the response contains results
    if geocode_data["status"] != "OK" or not geocode_data["results"]:
        return jsonify({"error": "Could not geocode the provided address"}), 400

    #get latitude and longitude
    location = geocode_data["results"][0]["geometry"]["location"]
    latitude = location["lat"]
    longitude = location["lng"]

    return {"latitude": latitude, "longitude": longitude}
