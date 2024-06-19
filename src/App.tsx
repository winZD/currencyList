import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import CurrencyList from "./currencyList/CurrencyList";

import HistoryByDate from "./historyByDate/HistoryByDate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tecaj" element={<CurrencyList />} />
        <Route path="/povijest/:currency/*" element={<HistoryByDate />} />
      </Routes>
    </Router>
  );
}

export default App;
