// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { useSignalR } from './hooks/useSignalR';
import { useLostItems } from './hooks/useLostItems';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refetch } = useLostItems();

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // ✅ Handle new lost item
  const handleNewLostItem = (data: any) => {
    console.log('📨 New lost item received via SignalR:', data);
    setRefreshTrigger(prev => prev + 1);
  };

  // ✅ Handle cancelled lost item
  const handleLostItemCancelled = (data: any) => {
    console.log('❌ Lost item cancelled received via SignalR:', data);
    setRefreshTrigger(prev => prev + 1);
  };

  // // ✅ Handle item marked as done
  // const handleItemMarkedAsDone = (data: any) => {
  //   console.log('✅ Item marked as done received via SignalR:', data);
  //   setRefreshTrigger(prev => prev + 1);
  // };

  const { isConnected } = useSignalR(
    handleNewLostItem,
    handleLostItemCancelled,
  );

  console.log('🔌 SignalR Connection Status:', isConnected ? '✅ Connected' : '❌ Disconnected');

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#22c55e',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;