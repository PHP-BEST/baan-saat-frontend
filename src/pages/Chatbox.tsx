import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchMessages, sentMessage } from '@/api/message.ts';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export interface Message {
  receiver: string;
  sender: string;
  text: string;
  url: string;
  createdAt?: string;
  room?: string;
}

interface ChatProps {
  id: string;
}

export function Chatbox({ id: receiverId }: ChatProps) {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [room, setRoom] = useState<string>('');

  const { data } = useQuery({
    queryKey: ['messages', receiverId],
    queryFn: () => fetchMessages(receiverId),
  });

  const mutation = useMutation({
    mutationFn: (message: Message) => sentMessage(message),
  });

  // Handle incoming messages via socket
  useEffect(() => {
    const handleIncomingMessage = (message: Message) => {
      setMessages((prev) => {
        if (
          !prev.find(
            (msg) =>
              msg.sender === message.sender &&
              msg.text === message.text &&
              msg.createdAt === message.createdAt,
          )
        ) {
          return [...prev, message];
        }
        return prev;
      });
    };
    socket.on('message', handleIncomingMessage);
    return () => {
      socket.off('message', handleIncomingMessage);
    };
  }, []);

  // Join/leave room
  useEffect(() => {
    if (user) {
      const roomId = [user._id, receiverId].sort().join('_');
      setRoom(roomId);
      socket.emit('join_room', roomId);
      setMessages([]);
    }
    return () => {
      if (room) socket.emit('leave_room', room);
    };
  }, [receiverId, user]);

  // Load messages from API
  useEffect(() => {
    if (data) setMessages(data as Message[]);
  }, [data]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && user) {
      const roomId = [user._id, receiverId].sort().join('_');
      const message: Message = {
        room: roomId,
        receiver: receiverId,
        sender: user._id,
        text: input,
        url: '',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);
      mutation.mutate(message);
      socket.emit('message', message);
      setInput('');
    }
  };

  const formatDateHeader = (dateString: string) => {
    const today = new Date();
    const messageDate = new Date(dateString);
    const diff = today.getDate() - messageDate.getDate();
    if (
      diff === 0 &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear()
    )
      return 'Today';
    if (
      diff === 1 &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear()
    )
      return 'Yesterday';
    return messageDate.toLocaleDateString();
  };

  let lastDate = '';

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      {/* Messages container */}
      <div className="flex-1 p-4 bg-white overflow-y-auto overflow-x-hidden">
        {messages.map((msg, index) => {
          const time = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';
          const isMine = msg.sender === user?._id;
          const messageDate = msg.createdAt
            ? new Date(msg.createdAt).toDateString()
            : '';
          const showDateHeader = messageDate !== lastDate;
          if (showDateHeader) lastDate = messageDate;

          return (
            <div key={index}>
              {/* Date header */}
              {showDateHeader && (
                <div className="text-center text-gray-400 text-sm my-2">
                  {msg.createdAt && formatDateHeader(msg.createdAt)}
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-2xl shadow-sm max-w-[70%] break-words ${isMine ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}
                >
                  {/* File preview */}
                  {msg.url && (
                    <>
                      {msg.url.match(/\.(jpg|jpeg|png|gif)$/i) && (
                        <img
                          src={msg.url}
                          alt="sent file"
                          className="rounded-lg mb-1 max-h-60 object-contain"
                        />
                      )}
                      {msg.url.match(/\.(mp4|webm|mov)$/i) && (
                        <video
                          src={msg.url}
                          controls
                          className="rounded-lg mb-1 max-h-60"
                        />
                      )}
                      {msg.url.match(/\.pdf$/i) && (
                        <a
                          href={msg.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-sm text-blue-100 hover:text-blue-300"
                        >
                          View PDF
                        </a>
                      )}
                    </>
                  )}

                  {/* Text */}
                  {msg.text && <p className="break-words">{msg.text}</p>}

                  {/* Time */}
                  <div
                    className={`text-[0.7rem] mt-1 ${isMine ? 'text-blue-100 text-right' : 'text-gray-500 text-left'}`}
                  >
                    {time}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 bg-gray-50 border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
