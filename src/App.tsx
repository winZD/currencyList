import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import CurrencyList from "./currencyList/CurrencyList";
import History from "./history/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tecaj" element={<CurrencyList />} />
        <Route path="/povijest/:currency" element={<History />} />

        <Route path="/dynamic/:id" element={<p>hhhh</p>} />
      </Routes>
    </Router>
  );
}

export default App;
