export default function Notification() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background-header-footer font-serif p-4">
      <h1 className="text-4xl font-bold mb-6">
        You have 876 unread notifications
      </h1>
      <p className="text-lg mb-4 text-center">read now or you will DIE!</p>
      <ul className="list-disc list-inside mb-6 text-left max-w-md">
        <li>message 1</li>
        <li>message 2</li>
        <li>message 3</li>
      </ul>
      <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition">
        Setting
      </button>
    </div>
  );
}
