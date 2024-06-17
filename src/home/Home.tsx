import { Link } from "react-router-dom";
import "./home.css";

const CURRENCY = "USD";

function Home() {
  return (
    <div className="container">
      <div className="card">
        <Link to="/tecaj">
          <button>Tečaj</button>
        </Link>
        <Link to={`/povijest/${CURRENCY}`}>
          <button>Povijest</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
