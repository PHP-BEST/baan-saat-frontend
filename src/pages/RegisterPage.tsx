import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  return (
    <div>
      <p className="text-bold text-2xl">This is Register Page</p>
      <Button
        variant="secondary"
        onClick={() => {
          alert("Register button clicked... Go to Landing Page");
        }}
        asChild
        className="bg-green-900 text-white"
      >
        <Link to="/">Submit</Link>
      </Button>
    </div>
  );
};
