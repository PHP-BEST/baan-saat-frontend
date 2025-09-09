import React from 'react';

const LoginPage: React.FC = () => {

  const googleUrl = 'http://localhost:5000/auth/google' 
  const facebookUrl = 'http://localhost:5000/auth/facebook' 
  const lineUrl = 'http://localhost:5000/auth/line' 

  return (
    <>
      <button onClick={() => window.location.href = googleUrl}>Sign in with Google</button>
      <button onClick={() => window.location.href = facebookUrl}>Sign in with Facebook</button>
      <button onClick={() => window.location.href = lineUrl}>Sign in with Line</button>
    </>
  );
};

export default LoginPage;
