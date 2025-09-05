import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AccountImageProps {
  width?: number;
}

const AvatarImage = ({ width }: AccountImageProps) => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const handleClick = () => {
    alert('Go to Account Page to see Your Account');
    navigate('/account');

    // Avoiding no-unused-vars problems, I will remove later... - Best
    setAvatarUrl('');
    // ===============================================================
  };

  if (!width) {
    width = 52;
  }

  return (
    <div
      className={`bg-background-profile rounded-full flex items-center justify-center overflow-hidden cursor-pointer`}
      onClick={handleClick}
      style={{ width: width, height: width }}
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
