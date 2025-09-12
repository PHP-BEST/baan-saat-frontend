import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ActionButton from '@/components/our-components/actionButton';

const HeaderLanding = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-3 py-1 bg-background-header-footer flex justify-between items-center">
        <div className="w-full max-w-[50%] flex gap-3 justify-start items-center">
        {/* Logo */}
        <img
          src="/logo.png"
          width={70}
          height={70}
          alt="Baan Saat Logo"
          className="cursor-pointer"
          onClick={() => {
            navigate('/');
          }}
        />

        <div className="text-xl font-bold" >
        บ้านสะอาด
        </div>
        </div>
      

      {/* Right side Buttons */}
      <div className="flex items-center gap-4">
          {/* Login */}
          <ActionButton
          buttonColor="blue"
          buttonType="filled"
          onClick={() => {
            alert('Login button clicked');
          }}
        >
          <Link to="/login">Login</Link>
        </ActionButton>
      </div>
    </header>
  );
};

export default HeaderLanding;