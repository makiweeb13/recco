import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/store';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function useSocket() {
  const socketRef = useRef(null);
  const { user, addNotification, setUnreadCount } = useStore();

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true
    });
    socketRef.current = socket;

    socket.on('connect', () => {});

    socket.on('notification', (data) => {
      addNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return socketRef.current;
}
