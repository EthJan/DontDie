import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Home from "./components/pages/Home/Home"
import Volunteer from "./components/pages/Volunteer/Volunteer"

export default function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/report" element={<Report/>} /> */}
        <Route path="/volunteer" element={<Volunteer/>} />
        <Route path="*" element={<Home/>} />
      </Routes>
    </Router>
  );
}