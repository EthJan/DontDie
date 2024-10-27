import requests
#import logging

GEOCODING_API_KEY = "AIzaSyCZJxjBwsEYfsZSnpMyCffg-4I3HMesCkM"  # Replace with your actual API key

def geocode_address(address):
    geocoding_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GEOCODING_API_KEY}"
    #try:
    response = requests.get(geocoding_url)
    response.raise_for_status()
    geocode_data = response.json()

    #logging.debug(f"Geocode API response: {geocode_data}")
    #print("Geocode API response:", geocode_data)

    # Check if the response contains results
    if geocode_data["status"] != "OK" or not geocode_data["results"]:
        logging.error("Geocoding API did not return OK status or results are empty.")
        return None

    # Correct extraction of latitude and longitude from the JSON response
    location = geocode_data["results"][0]["geometry"]["location"]
    latitude = location["lat"]
    longitude = location["lng"]
    return {"latitude": latitude, "longitude": longitude}
    # except requests.exceptions.RequestException as e:
    #     logging.error(f"RequestException in geocode_address: {e}")
    #     return None
    # except KeyError:
    #     logging.error("KeyError in parsing geocode response")
    #     return None

