import Footer from '@/components/our-components/footer';
import Header from '@/components/our-components/header';

const AccountPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-grow">
        <p>This is AccountPage</p>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
