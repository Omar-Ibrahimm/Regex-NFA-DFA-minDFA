import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="w-full h-16 flex items-center justify-center bg-primary border-b border-card-border">
      <Link to="/">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Regex Automata Visualizer
        </h1>
      </Link>
    </nav>
  );
};

export default Navbar;
