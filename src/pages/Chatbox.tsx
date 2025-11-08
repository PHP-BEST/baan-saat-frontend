import { useState, useRef, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchMessages, sentMessage } from '@/api/message.ts';
import { io } from 'socket.io-client';
import { API_ROOT } from '@/config/api';

const socket = io(`${API_ROOT}`);

export interface Message {
  receiver: string;
  sender: string;
  text: string;
  url: string;
  createdAt?: string;
  room: string;
}

interface ChatProps {
  id: string[];
}

export function Chatbox({ id: receiveId }: ChatProps) {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [room, setRoom] = useState<string>('');

  const { data } = useQuery({
    queryKey: ['messages', receiveId],
    queryFn: () => fetchMessages(receiveId[1]),
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
      const roomId = receiveId[1];
      setRoom(roomId);
      socket.emit('join_room', roomId);
      setMessages([]);
    }
    return () => {
      if (room) socket.emit('leave_room', room);
    };
  }, [receiveId[1], user, receiveId[0]]);

  // Load messages from API
  useEffect(() => {
    if (data) setMessages(data as Message[]);
  }, [data]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || !user) return;

    const roomId = receiveId[1];
    let fileUrl = '';

    try {
      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch(`${API_ROOT}/api/storage`, {
          method: 'POST',
          body: formData,
        });

        const data = await uploadRes.json();

        // ⚡ Fix: use fileUrlList from backend response
        fileUrl = data.fileUrlList?.[0] || '';
        setIsUploading(false);
      }

      // 2️⃣ Construct message
      const message: Message = {
        room: roomId,
        receiver: receiveId[0],
        sender: user._id,
        text: input.trim(),
        url: fileUrl,
        createdAt: new Date().toISOString(),
      };

      // 3️⃣ Update UI instantly
      setMessages((prev) => [...prev, message]);

      // 4️⃣ Save to DB
      mutation.mutate(message);

      // 5️⃣ Emit via socket
      socket.emit('message', message);

      // 6️⃣ Reset inputs
      setInput('');
      setSelectedFile(null);
    } catch (err) {
      console.error('Error sending message with file:', err);
      setIsUploading(false);
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
                className={`mb-3 flex ${
                  isMine ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-2 rounded-2xl shadow-sm max-w-[70%] break-words ${
                    isMine
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-black rounded-bl-none'
                  }`}
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
                    className={`text-[0.7rem] mt-1 ${
                      isMine
                        ? 'text-blue-100 text-right'
                        : 'text-gray-500 text-left'
                    }`}
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

      {/* File preview before send */}
      {selectedFile && (
        <div className="px-4 py-2 bg-gray-100 flex items-center justify-between text-sm border-t">
          <span className="truncate">{selectedFile.name}</span>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✖
          </button>
        </div>
      )}

      {/* Uploading indicator */}
      {isUploading && (
        <div className="text-center text-gray-400 text-sm py-1">
          Uploading file...
        </div>
      )}

      {/* Input area */}
      <div className="p-3 bg-gray-50 border-t flex items-center gap-2">
        <input
          type="file"
          accept="image/*,video/*"
          id="fileUpload"
          className="hidden"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <label
          htmlFor="fileUpload"
          className="cursor-pointer bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          📎
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // prevent new line
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSend}
          disabled={isUploading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
