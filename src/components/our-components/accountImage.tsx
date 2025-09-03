import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AvatarImage = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const handleClick = () => {
    alert('Go to Account Page to see Your Account');
    navigate('/account');

    // Avoiding no-unused-vars problems, I will remove later... - Best
    setAvatarUrl('');
    // ===============================================================
  };

  return (
    <div
      className="w-[52px] h-[52px] bg-background-profile rounded-full mx-auto flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
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
