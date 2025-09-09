import { useSession } from '@/context/AuthContext';
import React from 'react';

const MainPage: React.FC = () => {
  const { session } = useSession();

  console.log(session)

  if (session == null) return;

  return (
    <>
      <h1>Home</h1>
      <p>{session.name || "unknown"}</p>
      <p>{session.role || "unknown"}</p>
      <button>Sign out</button>
    </>
  );
};

export default MainPage;
