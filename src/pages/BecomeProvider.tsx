import { Link } from 'react-router-dom';
export default function BecomeProvider() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background-header-footer font-serif p-4 bounded-lg">
      <h1 className="text-4xl font-bold mb-6">Become a Service Provider</h1>
      <p className="text-lg mb-4 text-center">
        Join our community of service providers and start offering your services
        to customers today!
      </p>
      <ul className="list-disc list-inside mb-6 text-left max-w-md">
        <li>Create and manage your service listings.</li>
        <li>Connect with potential customers.</li>
        <li>Grow your business with our platform.</li>
      </ul>
      <Link
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
        to="/onboard"
      >
        Get Started
      </Link>
    </div>
  );
}
