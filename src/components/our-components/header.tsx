import { MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';
import AvatarImage from './accountImage';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState<string>('');

  const handleSearch = () => {
    if (searchInput) {
      alert(`You're searching this: ${searchInput}`);
    } else {
      alert("There's nothing...");
    }
  };

  const handleClickChat = () => {
    alert('Go to Account Page to see Chats');
    navigate('/account');
  };

  const handleClickRequest = () => {
    alert('Go to Account Page to see Requests');
    navigate('/account');
  };

  return (
    <header className="w-full px-3 py-1 bg-background-header-footer flex justify-between items-center">
      {/* Left Side */}
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

        {/* Search Box */}
        <div className="bg-white w-full h-[50px] flex gap-1 items-center pl-1 pr-3">
          <Search
            width={28}
            height={28}
            className={`${searchInput ? 'cursor-pointer' : ''}`}
            onClick={handleSearch}
          />
          <input
            type="text"
            className="w-full focus:outline-none focus:border-none"
            onChange={(e) => {
              e.preventDefault();
              setSearchInput(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-fit max-w-[50%] flex gap-3 items-center">
        {/* Create a request */}
        <p
          className="text-[20px] underline cursor-pointer"
          onClick={handleClickRequest}
        >
          Create a request
        </p>
        {/* Chat */}
        <MessageCircle
          width={48}
          height={48}
          className="cursor-pointer"
          onClick={handleClickChat}
        />
        {/* Avatar Image */}
        <AvatarImage />
      </div>
    </header>
  );
};
export default Header;
