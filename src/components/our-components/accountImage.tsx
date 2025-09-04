import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

const AvatarImage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleClick = () => {
    alert('Go to Account Page to see Your Account');
    navigate('/account');
  };

  return (
    <div
      className="w-[52px] h-[52px] bg-background-profile rounded-full mx-auto flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleClick}
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
