fetch("http://127.0.0.1:5000/reportSubmit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      category: "flood",
      address: "89 Chestnut St, Toronto, ON",
      status: "confirmed",
      description: "Flooding due to heavy rain",
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
  console.log("Submitted");
  setName("");
  setPhone("");
  setEmail("");
  setAddress("");
}