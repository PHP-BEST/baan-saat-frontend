export default function ServiceCard() {
  return (
    <div className="w-full max-w-[300px] h-[250px] flex flex-col items-center bg-white border rounded-2xl shadow-sm m-0">
      <img
        src="https://picsum.photos/200/300"
        alt="Service Cover Image"
        className="w-full h-2/3 object-cover rounded-t-2xl mb-4"
      />
      <div className="w-full h-1/3 flex flex-col items-start px-4">
        <h2 className="text-lg font-bold">Service Title</h2>
        <p className="text-sm text-gray-600">Service Description</p>
      </div>
    </div>
  );
}
