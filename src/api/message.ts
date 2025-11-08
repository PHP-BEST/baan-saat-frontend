import axios from 'axios';
import { API_ROOT } from '@/config/api';

const BASE_URL = `${API_ROOT}/api/messages`;

export interface Message {
  room: string;
  receiver: string;
  sender: string;
  text: string;
  url: string;
  createdAt?: string;
}

// Fetch messages safely
export const fetchMessages = async (room: string): Promise<Message[]> => {
  if (!room) return [];
  try {
    const { data } = await axios.get<Message[]>(`${BASE_URL}/${room}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error('Fetching messages failed:', error);
    return [];
  }
};

// Send a message safely
export const sentMessage = async (
  messageData: Message,
): Promise<Message | null> => {
  if (!messageData.receiver) return null;
  try {
    const { data } = await axios.post<Message>(
      `${BASE_URL}/send/${messageData.receiver}`,
      messageData,
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    console.error('Sending message failed:', error);
    return null;
  }
};
