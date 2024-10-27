import './Volunteer.css';
import { useState, useEffect } from 'react';

const Volunteer = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({name: false, phone: false, email: false, address: false});
  const [isFormValid, setIsFormValid] = useState(false);

  // improved user experience by providing feedback to the user when the form is invalid as a future feature
  // implement when boxes are touched the boxes turn red

  const setNameChange = e => {setName(e.target.value)};
  const setPhoneChange = e => {setPhone(e.target.value)};
  const setEmailChange = e => {setEmail(e.target.value)};
  const setAddressChange = e => {setAddress(e.target.value)};

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [name, phone, email, address]);

  const validateForm = () => {
    name ? errors.name = false : errors.name = true;
    !phone || !/^\d{9,11}$/.test(phone) ? errors.phone = true : errors.phone = false;
    !email || !/\S+@\S+\.\S+/.test(email) ? errors.email = true : errors.email = false;
    address ? errors.address = false : errors.address = true;
    return !errors.name && !errors.phone && !errors.email && !errors.address;
  };

  const handleSubmit = () => {
    if (!isFormValid) { return; }
    fetch("http://127.0.0.1:5000/volunteerSubmit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
          address: address
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
    
    // name, phone, email, address
    return (
      <div className="volunteer">
        <label htmlFor="name">Name</label>
        <input type="text" value={name} onChange={setNameChange} placeholder="Firstname Lastname" />

        <label htmlFor="phone">Phone</label>
        <input type="text" value={phone} onChange={setPhoneChange} placeholder="1234567890" className={errors["phone"] && "errorinput"} />

        <label htmlFor="email">Email</label>
        <input type="text" value={email} onChange={setEmailChange} placeholder="myemail@email.com" className={errors["email"] && "errorinput"} />

        <label htmlFor="address">Address</label>
        <input type="text" value={address} onChange={setAddressChange} placeholder="89 Chestnut Street, Toronto, CA" className={errors["address"] && "errorinput"} />

        <button onClick={handleSubmit} disabled={!isFormValid} className={!isFormValid && "errorbutton"}>Submit</button>
		  </div>
    );
}

export default Volunteer;

