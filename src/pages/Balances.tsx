export default function Balances() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background-header-footer font-serif p-4">
      <h1 className="text-4xl font-bold mb-6">Balances</h1>
      <p className="text-lg mb-4 text-center">-736,844 Bahts</p>
      <ul className="list-disc list-inside mb-6 text-left max-w-md">
        <li>-700,000 Bahts to gamble888.com</li>
        <li>-40,000 Bahts to Monkey NFTs</li>
        <li>+3,156 Bahts from Bitcoin</li>
      </ul>
      <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition">
        Get Started
      </button>
    </div>
  );
}
