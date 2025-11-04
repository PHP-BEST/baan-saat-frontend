import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/messages';

export interface Message {
  receiver: string;
  sender: string;
  text: string;
  url: string;
  createdAt?: string;
}

// Fetch messages safely
export const fetchMessages = async (receiverId: string): Promise<Message[]> => {
  if (!receiverId) return [];
  try {
    const { data } = await axios.get<Message[]>(`${BASE_URL}/${receiverId}`, {
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
