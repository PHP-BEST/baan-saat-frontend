import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <div>
      <p className="text-bold text-2xl">This is Error Page</p>
      <Button
        variant="secondary"
        onClick={() => {
          alert("Error button clicked... Go to Landing Page");
        }}
        asChild
        className="bg-black text-white"
      >
        <Link to="/">
          <p>Go Back</p>
        </Link>
      </Button>
    </div>
  );
};
