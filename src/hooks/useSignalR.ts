// src/hooks/useSignalR.ts
import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '../context/AuthContext';

const SIGNALR_URL = import.meta.env.VITE_SIGNALR_URL || 'https://localhost:7149/notificationHub';

export const useSignalR = (
  onNewLostItem?: (data: any) => void,
  onLostItemCancelled?: (data: any) => void,
  onNewExpiredItems?: (data: any) => void // <-- NEW PARAMETER
) => {
  const { isAuthenticated } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState<any>(null);
  
  const onNewLostItemRef = useRef(onNewLostItem);
  const onLostItemCancelledRef = useRef(onLostItemCancelled);
  const onNewExpiredItemsRef = useRef(onNewExpiredItems); // <-- NEW REF
  
  useEffect(() => {
    onNewLostItemRef.current = onNewLostItem;
    onLostItemCancelledRef.current = onLostItemCancelled;
    onNewExpiredItemsRef.current = onNewExpiredItems;  // <-- NEW REF
  }, [onNewLostItem, onLostItemCancelled,onNewExpiredItems]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    if (connectionRef.current) {
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    // ✅ NEW LOST ITEM
    connection.on('NewLostItemReported', (data) => {
      console.log('📨 New lost item reported:', data);
      setLastNotification(data);
      if (onNewLostItemRef.current) {
        onNewLostItemRef.current(data);
      }
    });

    // ✅ CANCELLED LOST ITEM
    connection.on('LostItemCancelled', (data) => {
      console.log('❌ Lost item cancelled:', data);
      setLastNotification(data);
      if (onLostItemCancelledRef.current) {
        onLostItemCancelledRef.current(data);
      }
    });

    // ✅ NEW EXPIRED ITEM <-- NEW 
     connection.on('NewExpiredItems', (data) => {
      console.log('⏰ New expired items:', data);
      setLastNotification(data);
      if (onNewExpiredItemsRef.current) {
        onNewExpiredItemsRef.current(data);
      }
    });

    // ✅ ITEM MARKED AS DONE
    // connection.on('ItemMarkedAsDone', (data) => {
    //   console.log('✅ Item marked as done:', data);
    //   setLastNotification(data);
    // });

    connection.start()
      .then(() => {
        console.log('✅ SignalR connected');
        setIsConnected(true);
      })
      .catch((err) => {
        console.error('❌ SignalR connection failed:', err);
        setIsConnected(false);
      });

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
    };
  }, [isAuthenticated]);

  return {
    isConnected,
    lastNotification,
  };
};