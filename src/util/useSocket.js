import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/store';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function useSocket() {
  const socketRef = useRef(null);
  const { addNotification, token } = useStore();

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token }
    });
    socketRef.current = socket;

    socket.on('connect', () => {});

    socket.on('notification', (data) => {
      addNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return socketRef.current;
}
