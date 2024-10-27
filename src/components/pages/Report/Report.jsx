import './Report.css';
import { useState, useEffect } from 'react';

import Boxselect from '../../Boxselect/Boxselect';

const Report = () => {
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({address: false, category: false, status: false, description: false});
  const [isFormValid, setIsFormValid] = useState(false);

  // improved user experience by providing feedback to the user when the form is invalid as a future feature
  // implement when boxes are touched the boxes turn red

  const setAddressChange = e => {setAddress(e.target.value)};
  const setCategoryChange = e => {setCategory(e.target.value)};
  const setStatusChange = e => {setStatus(e.target.value)};
  const setDescriptionChange = e => {setDescription(e.target.value)};

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [address, category, status, description]);

  const validateForm = () => {
    const newErrors = {};
    newErrors.address = !address;
    newErrors.category = !category;
    newErrors.status = !status;
    newErrors.description = !description;
  
    setErrors(newErrors);
  
    return !newErrors.address && !newErrors.category && !newErrors.status && !newErrors.description;
  };

  const handleSubmit = () => {
    if (!isFormValid) { return; }
    fetch("http://127.0.0.1:5000/reportSubmit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: category,
        address: address,
        status: status,
        description: description
      }),
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
      console.log("Submitted");
      setAddress("");
      setCategory("");
      setStatus("");
      setDescription("");
    }
    
    return (
      <div className="report">
        <h1>Report Disasters</h1>
        <h3>Report potential hazards of natural disasters or ongoing natural disasters.</h3>

        <label htmlFor="address">Address</label>
        <input type="text" value={address} onChange={setAddressChange} placeholder="89 Chestnut Street, Toronto, CA" />

        <label htmlFor="category">Category</label>
        <select value={category} onChange={setCategoryChange}>
          <option value="">Select Category</option>
          <option value="fire">Fire</option>
          <option value="flood">Flood</option>
          <option value="tornado">Tornado</option>
          <option value="drought">Drought</option>
          <option value="volcano">Volcano</option>
          <option value="landslide">Landslide</option>
          <option value="earthquake">Earthquake</option>
          <option value="avalanche">Avalanche</option>
          <option value="snowstorm">Snowstorm</option>
        </select>

        <label htmlFor="status">Status</label>
        <select value={status} onChange={setStatusChange}>
          <option value="">Select Status</option>
          <option value="hazard">Hazard</option>
          <option value="ongoing">Ongoing</option>
          <option value="over">Imminent Threat Over</option>
        </select>

        <label htmlFor="description">Description</label>
        <input type="text" value={description} onChange={setDescriptionChange} placeholder="Roof has been ripped off of houses" />

        <button onClick={handleSubmit} disabled={!isFormValid}>Submit</button>
        <Boxselect />
		  </div>
    );
}

export default Report;

