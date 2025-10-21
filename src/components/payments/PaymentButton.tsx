import { getPaymentStatusByPostId } from '@/api/payment';
import ActionButton from '../our-components/actionButton';
import { useEffect, useState } from 'react';

type PaymentButtonDetail = {
  text: string;
  color: 'blue' | 'red' | 'green' | undefined;
  disabled: boolean;
};

type PaymentButtonType = {
  postId: string;
  openModal: (open: boolean) => void; // Fixed type
};

const PaymentButton = ({ postId, openModal }: PaymentButtonType) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        setLoading(true);
        const status = await getPaymentStatusByPostId(postId);
        setPaymentStatus(status);
      } catch (error) {
        console.error('Error fetching payment status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [postId]);

  let buttonDetail: PaymentButtonDetail = {
    text: 'Pay',
    color: 'blue',
    disabled: loading, // Disable while loading
  };

  if (loading) {
    buttonDetail.text = 'Loading...';
    buttonDetail.disabled = true;
  } else if (paymentStatus === 'processing') {
    buttonDetail.text = 'Process...';
    buttonDetail.disabled = true;
  } else if (paymentStatus === 'succeeded') {
    buttonDetail.text = 'Completed';
    buttonDetail.disabled = true;
    buttonDetail.color = 'green';
  }

  return (
    <ActionButton
      buttonColor={buttonDetail.color}
      disabled={buttonDetail.disabled}
      onClick={() => openModal(true)} // Fixed onClick handler
    >
      {buttonDetail.text}
    </ActionButton>
  );
};

export default PaymentButton;
