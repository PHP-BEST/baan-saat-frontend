import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/our-components/header';
import Footer from '@/components/our-components/footer';
import type { Service } from '@/interfaces/Service';
import type { User } from '@/interfaces/User';
import ActionButton from '@/components/our-components/actionButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BookingPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [customer, setCustomer] = useState<User | null>(null);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState<'submit' | 'cancel' | null>(
    null,
  );

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await axios.get(`/api/services/${serviceId}`);
        setService(response.data);
      } catch (error) {
        console.error(error);
        setService(null);
      }
    }
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  useEffect(() => {
    async function fetchCustomer() {
      if (service?.customerId) {
        try {
          const response = await axios.get(`/api/users/${service.customerId}`);
          setCustomer(response.data);
        } catch (error) {
          console.error(error);
          setCustomer(null);
        }
      }
    }
    fetchCustomer();
  }, [service?.customerId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow min-h-full p-4 bg-white flex justify-center ">
        <div className="w-[65%] min-h-full ">
          <div className="w-full min-h-full bg-gray-100 rounded-2xl border border-gray-300 p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-2 text-center">Offering</h1>
            {/* Service Details Section */}
            <img
              src={service?.coverPhotoUrl || '/default-cover.jpg'}
              alt={service?.title || 'No Image'}
              className="mb-4 mx-auto rounded-lg"
            />
            <h2 className="text-xl font-semibold">
              ชื่อกระทู้: {service?.title || 'Place Holder Title'}
            </h2>
            <p>ผู้โพสต์: {customer?.name || 'Place Holder Name'}</p>
            <p className="">
              รายละเอียดกระทู้:{' '}
              {service?.description || 'Service description will appear here.'}
            </p>
            <p className="font-bold ">งบประมาณ: {service?.budget ?? 0} THB</p>
            <p className="">
              เบอร์ติดต่อ: {service?.telNumber || '000-000-0000'}
            </p>
            <p className="">
              สถานที่: {service?.location || 'Place Holder Location'}
            </p>
            <p className="">
              วันที่ต้องการรับบริการ:{' '}
              {service?.date
                ? new Date(service.date).toLocaleDateString()
                : '01/01/2024'}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {service?.tags && service.tags.length > 0 ? (
                service.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No tags available</span>
              )}
            </div>

            <hr className="my-6" />

            {/* Provider Offers Section */}
            <h2 className="text-xl font-semibold mt-4">
              รายละเอียดข้อเสนอของคุณ
            </h2>
            <p className="">วันที่สามารถให้บริการ</p>
            <input
              type="date"
              className="w-[50%] mt-1 p-2 border rounded-lg"
              placeholder="Select service date"
            />
            <p className="mt-4">ราคาที่เสนอ</p>
            <input
              type="number"
              className="w-[50%] mt-1 p-2 border rounded-lg"
              placeholder="Enter your price"
            />
            <p className="mt-4">รายละเอียดเพิ่มเติม (ถ้ามี)</p>
            <textarea
              className="w-full mt-1 p-2 border rounded-lg"
              rows={4}
              placeholder="Additional details (optional)"
            ></textarea>

            {/* Confirmation Button Section */}
            <div className="flex justify-center mt-6 gap-4">
              <ActionButton
                buttonColor="green"
                buttonType="outline"
                onClick={() => setShowConfirm('submit')}
                fontSize={16}
              >
                Submit
              </ActionButton>
              <ActionButton
                buttonColor="red"
                buttonType="outline"
                onClick={() => setShowConfirm('cancel')}
                fontSize={16}
              >
                Cancel
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] text-center">
            <p className="mb-4 text-lg font-semibold">
              {showConfirm === 'submit'
                ? 'ต้องการส่งคำขอหรือไม่?'
                : 'ต้องการยกเลิกการส่งคำขอหรือไม่? ข้อมูลการกรอกจะไม่ถูกบันทึก'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 cursor-pointer"
                onClick={() => setShowConfirm(null)}
              >
                No
              </button>
              <button
                className={`px-4 py-2 rounded ${showConfirm === 'submit' ? 'bg-green-500 text-white cursor-pointer' : 'bg-red-500 text-white cursor-pointer'}`}
                onClick={() => {
                  setShowConfirm(null);
                  if (showConfirm === 'submit') {
                    alert('ส่งคำขอสำเร็จ');
                    navigate(-1);
                  } else {
                    navigate(-1);
                  }
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
