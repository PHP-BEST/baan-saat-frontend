import { useUser } from '@/context/UserContext';
import { useParams } from 'react-router-dom';

export default function ChatPage() {
  const { user } = useUser();
  const { applyId } = useParams();
  if (!user) return;

  return <div>Chat Page for applyId: {applyId}</div>;
}
