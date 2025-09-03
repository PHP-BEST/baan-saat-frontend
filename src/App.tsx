import MainLayout from './layouts/MainLayout';
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return (
    <MainLayout>
      <RouterProvider router={router} />
    </MainLayout>
  );
}

export default App;
