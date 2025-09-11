import React from 'react';
import { useSession } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import Axios from '@/auth/interceptor';

const MainPage: React.FC = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await Axios.delete('http://localhost:5000/logout');

      if (response.status === 200) {
        navigate('/login');
      } else {
        console.error('Sign out failed');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  if (session == null) return;

  return (
    <>
      <h1>Home</h1>
      <p>{session.name || "unknown"}</p>
      <p>{session.role || "unknown"}</p>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  );
};

export default MainPage;
