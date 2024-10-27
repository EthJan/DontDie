import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Home from "./components/pages/Home/Home"
import Report from "./components/pages/Report/Report"
import Volunteer from "./components/pages/Volunteer/Volunteer"
// import About from "./components/pages/About/About"

export default function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/report" element={<Report/>} />
        <Route path="/volunteer" element={<Volunteer/>} />
        {/* <Route path="/about" element={<About/>} /> */}
        <Route path="*" element={<Home/>} />
      </Routes>
    </Router>
  );
}