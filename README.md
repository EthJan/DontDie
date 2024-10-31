# Safelink

Site to help connect people with the world during natural disasters. Made during NewHacks 2024 Hackathon. 

### **Inspiration**
In times of crisis, we are often unsure of where to turn or how to help. SafeLink was created to bridge that gap—to turn individual actions into a collective response and let the communities be part of the solution. By enabling people to share real-time information, SafeLink empowers communities to stay safe, informed, and connected. Our goal is to make vital information accessible to everyone so that when disaster strikes, communities are equipped to support each other.

### **What it does**
SafeLink is a crowdsourced disaster mapping platform using a web-based application. Information on hazards and available organizations is shown near the user. This information is displayed in a Google map format, where each update is pinned to a specific location, enabling others to make informed decisions during emergencies. SafeLink is designed to connect individuals who want to help to nearby organizations. When users identify themselves as volunteers, they share their location and are shown nearby organizations that may require support.

### **How we built it**
The front end was designed for simplicity and accessibility, we implemented a clean interface with minimal clicks required to post updates or locate resources. React.js was used for a responsive interface that can handle fast data refreshes. SafeLink’s backend was built to support real-time data handling. This required a robust database and server setup to quickly process location data and user input which was handled by Flask & SQL. To implement precise location tracking and visualization, we integrated geolocation services. This involved Google Maps & Geocoding API integrations.

### **Running the app**
1. Make sure you are in the base folder
2. `npm i` to install front-end dependencies
3. `npm run dev` to run the React front-end
4. ctrl + left click the url that shows up to open it (app will not work yet since back-end is not running)
5. `cd python` to navigate to the python folder
6. `python -m venv .venv` (Windows) or `python3 -m venv .venv` (Mac/Linux) to create the virtual environment
7. `.venv/Scripts/activate` (Windows) or `source .venv/bin/activate` (Mac/Linux) to activate the virtual environment
8. `pip install -r requirements.txt` to install dependencies in the virtual environment
9. `flask run` to run the back-end (might have to use full path if you don't have flask on PATH)
10. Go to the url before and refresh
