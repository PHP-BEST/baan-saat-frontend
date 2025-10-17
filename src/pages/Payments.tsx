export default function Payments() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background-header-footer font-serif p-4">
      <h1 className="text-4xl font-bold mb-6">Payments history</h1>
      <p className="text-lg mb-4 text-center">18/10/2568</p>
      <ul className="list-disc list-inside mb-6 text-left max-w-md">
        <li>+500 Bahts from Thaksin Shinawatra</li>
        <li>-1000 Bahts to HotTV</li>
        <li>+10000 Bahts from Lottery</li>
      </ul>
      <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition">
        Setting
      </button>
    </div>
  );
}
