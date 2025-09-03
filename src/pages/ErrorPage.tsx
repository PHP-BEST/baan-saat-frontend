import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const ErrorPage = () => {
  return (
    <div>
      <p className="text-bold text-2xl text-red-500">This is Error Page</p>
      <Button
        variant="secondary"
        asChild
        className="bg-black text-white hover:bg-gray-800 transition duration-300"
      >
        <Link to="/">
          <p>Go Back</p>
        </Link>
      </Button>
    </div>
  );
};
