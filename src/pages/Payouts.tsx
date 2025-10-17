export default function Payouts() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background-header-footer font-serif p-4">
      <h1 className="text-4xl font-bold mb-6">
        ผมจะโอนเงินให้คุณ 1000 บาทประมาณตอนเที่ยงพรุ่งนี้
      </h1>
      <p className="text-lg mb-4 text-center">แต่</p>
      <ul className="list-disc list-inside mb-6 text-left max-w-md">
        <li>คุณต้องกรอกเลขบัญชี</li>
        <li>ยืนยันตัวตน</li>
      </ul>
      <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition">
        Get Started
      </button>
    </div>
  );
}
