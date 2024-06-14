import React from "react";
import { Link } from "react-router-dom";

const CURRENCY = "USD";

function Home() {
  return (
    <div>
      <Link to="/tecaj">
        <button>Tečaj</button>
      </Link>
      <Link to={`/povijest/${CURRENCY}`}>
        <button>Povijest</button>
      </Link>
    </div>
  );
}

export default Home;
