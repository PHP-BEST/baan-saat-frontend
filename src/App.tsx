import { RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { router } from './route';
function App() {
  return (
    <MainLayout>
      <RouterProvider router={router} />
    </MainLayout>
  );
}

export default App;
