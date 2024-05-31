import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Intro from "./page/Intro";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Calendarr from "./page/Calendarr";
import Login from "./page/Login";
import { Toaster } from "react-hot-toast";
import History from "./page/History";
function App() {
  return (
    <Router>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/calendar" element={<Calendarr />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
