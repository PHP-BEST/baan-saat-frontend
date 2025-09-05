import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

interface AccountImageProps {
  width?: number;
}

const AvatarImage = ({ width = 52 }: AccountImageProps) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = () => {
    alert('Go to Account Page to see Your Account');
    navigate('/account');
  };

  return (
    <div
      className={`bg-background-profile rounded-full flex items-center justify-center overflow-hidden cursor-pointer`}
      onClick={handleClick}
      style={{ width: width, height: width }}
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt="Avatar Image"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full" />
      )}
    </div>
  );
};

export default AvatarImage;
