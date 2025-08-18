import Counter from "@/components/our-components/counter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-bold text-2xl">This is Landing Page</p>

      {/* Buttons */}
      <div className="flex gap-4">
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
          className="bg-red-500 text-black hover:bg-red-400 transition duration-300"
        >
          <Link to="/xdza555+">What is this?</Link>
        </Button>
      </div>

      {/* Counter */}
      <Counter />
    </div>
  );
};
