// NotificationHandler.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import './NotificationHandler.css'; // Optional for styling

const socket = io('http://localhost:5000'); // Replace with your backend URL

const NotificationHandler = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Request permission if not already granted
    if (permission !== 'granted') {
      setTimeout(() => {
        Notification.requestPermission().then(result => {
          setPermission(result);
        });
      }, 1000); // slight delay after component mounts
    }

    // Listen to socket notifications
    socket.on('new_notification', (data) => {
      console.log('Received notification:', data);

      if (permission === 'granted') {
        showNotification(data.title, data.message);
      } else {
        toast.info(`${data.title}: ${data.message}`);
      }
    });

    return () => {
      socket.off('new_notification');
    };
  }, [permission]);

  const showNotification = (title, body) => {
    new Notification(title, {
      body,
      icon: '/notification-icon.png', // Optional icon path
    });
  };

  return null; // This component just runs in background
};

export default NotificationHandler;
