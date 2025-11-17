import { Search } from 'lucide-react';
import { useState } from 'react';
import AvatarImage from './accountImage';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import ActionButton from './actionButton';

interface HeaderProps {
  isHideSearchBar?: boolean;
}

const Header = ({ isHideSearchBar = false }: HeaderProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { user } = useUser();

  const handleSearch = () => {
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
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
        {!isHideSearchBar && (
          <div
            className="bg-white w-full h-[50px] flex gap-1 items-center pl-1 pr-3"
            id="Searchbar-header"
          >
            <Search
              width={28}
              height={28}
              className={`${query ? 'cursor-pointer' : ''}`}
              onClick={handleSearch}
            />
            <input
              type="text"
              className="w-full focus:outline-none focus:border-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Search..."
            />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="w-fit max-w-[50%] flex gap-3 items-center">
        {user ? (
          <AvatarImage />
        ) : (
          <ActionButton onClick={() => navigate('/login')}>
            Sign in
          </ActionButton>
        )}
      </div>
    </header>
  );
};

export default Header;
