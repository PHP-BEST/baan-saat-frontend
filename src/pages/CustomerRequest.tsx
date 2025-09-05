export default function CustomerRequestPage() {
  return (
    <>
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">Customer Request</h1>

      {/* Content */}
      <div className="w-full h-full flex flex-col items-center bg-white border rounded-2xl p-8 shadow-sm m-0 ">
        <div className="w-full max-h-[100vh] overflow-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="sticky top-0 bg-table-row-header">
              <tr>
                <th className="border border-gray-200 p-2">Service</th>
                <th className="border border-gray-200 p-2">Price</th>
                <th className="border border-gray-200 p-2">Date</th>
                <th className="border border-gray-200 p-2">Select</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 30 }).map((_, idx) => (
                <tr
                  key={`customer-request-${idx}`}
                  className="bg-table-row-content"
                >
                  <td className="border border-gray-200 p-2">Service {idx}</td>
                  <td className="border border-gray-200 p-2">$100</td>
                  <td className="border border-gray-200 p-2">01/01/2023</td>
                  <td className="border border-gray-200 p-2">
                    <input type="checkbox" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
