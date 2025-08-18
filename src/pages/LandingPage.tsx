import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div>
      <p className="text-bold text-2xl">This is Landing Page</p>
      <Button
        variant="outline"
        onClick={() => {
          alert("Landing button clicked");
        }}
        asChild
      >
        <Link to="/register">Register</Link>
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          alert("For what...");
        }}
        asChild
        className="bg-red-500 text-black"
      >
        <Link to="/xdza555+">What is this?</Link>
      </Button>
    </div>
  );
};
