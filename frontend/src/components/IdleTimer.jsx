import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// 3 minutes in milliseconds
const IDLE_TIME = 1 * 60 * 1000;

const IdleTimer = ({ children }) => {
  const { logout, isAuthenticated } = useAuth();
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        logout();
        toast.error('Session expired due to 1 minutes of inactivity', {
          id: 'idle-timeout', // Prevent duplicate toasts
          duration: 5000,
          icon: '⏳',
        });
      }, IDLE_TIME);
    }
  };

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const handleActivity = () => {
      resetTimer();
    };

    if (isAuthenticated) {
      resetTimer();
      events.forEach(event => {
        window.addEventListener(event, handleActivity);
      });
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, logout]);

  return children;
};

export default IdleTimer;
