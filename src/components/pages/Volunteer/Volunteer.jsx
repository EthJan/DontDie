import './Volunteer.css';

const Volunteer = () => {
    fetch("http://127.0.0.1:5000/reportSubmit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: "flood",
          address: "89 Chestnut St, Toronto, CA",
          status: "confirmed",
          description: "Flooding due to heavy rain",
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
      
    return (
        <div className="volunteer">
            something is showing nice
		</div>
    );
}

export default Volunteer;