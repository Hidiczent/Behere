// Navbar.tsx
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between">
      <div className="font-bold text-xl text-blue-600">MyWebsite</div>
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li>
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/service" className="hover:text-blue-600">
            Service
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
