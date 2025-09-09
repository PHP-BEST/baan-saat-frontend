import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="redirect" element={<RedirectPage />}/>
        </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;
