// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { useSignalR } from './hooks/useSignalR';
import { useLostItems } from './hooks/useLostItems';
import { useColdCaseItems } from './hooks/useColdCaseItems'; // <-- NEW IMPORT
import { useDisposalItems } from './hooks/useDisposalItems'; // <-- NEW IMPORT
import { useState, useEffect } from 'react';
import { useToast } from './hooks/useToast'; // <-- NEW IMPORT
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refetch } = useLostItems();
  const { fetchItems: refetchColdCase } = useColdCaseItems(); // <-- NEW
  const { fetchItems: refetchDisposal } = useDisposalItems(); // <-- NEW
  const { showToast } = useToast(); // <-- NEW

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

  // ✅ NEW HANDLER: Handle new expired items <-- NEW
  const handleNewExpiredItems = (data: any) => {
    console.log('⏰ New expired items received via SignalR:', data);
    
    // 1. Show a toast notification to the admin
    const message = `⏰ ${data.totalExpired} items have expired (${data.lostCount} lost, ${data.foundCount} found)`;
    showToast(message, 'info');

    // 2. Refresh the cold case and disposal lists to update badge counts
    // (The badge counts are fetched by the hooks, so just refetch them)
    refetchColdCase();
    refetchDisposal();
  };

  // // ✅ Handle item marked as done
  // const handleItemMarkedAsDone = (data: any) => {
  //   console.log('✅ Item marked as done received via SignalR:', data);
  //   setRefreshTrigger(prev => prev + 1);
  // };

  const { isConnected } = useSignalR(
    handleNewLostItem,
    handleLostItemCancelled,
    handleNewExpiredItems
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