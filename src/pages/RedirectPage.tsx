import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/AuthContext';

const RedirectPage: React.FC = () => {
  const { getSession } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getSession();
      if (data) {
        console.log("Session loaded successfully");
        navigate('/', { replace: true }); // React Router navigation - preserves context
      } else {
        navigate('/login', { replace: true });
      }
    })();
  }, [getSession, navigate]);

  return (
    <>
      <h1>Redirect...</h1>
    </>
  );
};

export default RedirectPage;