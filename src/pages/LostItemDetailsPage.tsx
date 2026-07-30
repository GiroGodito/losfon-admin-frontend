// // src/pages/LostItemDetailsPage.tsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { lostItemsApi } from '../api/lost-items';
// import type { LostItem } from '../types/lost-item.types';
// import { LostItemDetails } from '../components/lost-items/LostItemDetails';
// import { Spinner } from '../components/common/Spinner';
// import { Button } from '../components/common/Button';
// import { useToast } from '../hooks/useToast';

// export const LostItemDetailsPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [item, setItem] = useState<LostItem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchItem = async () => {
//       if (!id) return;
//       setIsLoading(true);
//       try {
//         const data = await lostItemsApi.getById(parseInt(id));
//         setItem(data);
//       } catch (error: any) {
//         setError(error.message || 'Failed to load item');
//         showToast(error.message || 'Failed to load item', 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchItem();
//   }, [id, showToast]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   if (error || !item) {
//     return (
//       <div className="max-w-4xl mx-auto py-8 px-4 text-center">
//         <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
//           <p className="text-red-400">{error || 'Item not found'}</p>
//           <Button
//             variant="outline"
//             className="mt-4"
//             onClick={() => navigate('/lost-items')}
//           >
//             Back to Lost Items
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <LostItemDetails item={item} />
//     </div>
//   );
// };
// src/pages/LostItemDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lostItemsApi } from '../api/lost-items';
import type { LostItem } from '../types/lost-item.types';
import { LostItemDetails } from '../components/lost-items/LostItemDetails';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { useToast } from '../hooks/useToast';

export const LostItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [item, setItem] = useState<LostItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await lostItemsApi.getById(parseInt(id));
        setItem(data);
      } catch (error: any) {
        setError(error.message || 'Failed to load item');
        showToast(error.message || 'Failed to load item', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id, showToast]);

  // ✅ HANDLER FOR MARK AS FOUND
  const handleMarkAsDone = async (itemId: number) => {
    try {
      // For now use a simple prompt – consider replacing with a modal later
      const foundBy = prompt('Enter the SSO officer who found the item:');
      if (!foundBy) return;
      
      const response = await lostItemsApi.markAsDone(itemId, {
        turnInBy: 'System Administrator',
        foundBy: foundBy,
        filePath: undefined,
      });
      
      if (response.success) {
        showToast(response.message || 'Item marked as found successfully', 'success');
        navigate('/lost-items');
      } else {
        showToast(response.message || 'Failed to mark item as found', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to mark item as found', 'error');
    }
  };

  // ✅ HANDLER FOR DELETE
  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this lost item report? This action cannot be undone.')) return;
    
    try {
      await lostItemsApi.delete(itemId);
      showToast('Item deleted successfully', 'success');
      navigate('/lost-items');
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400">{error || 'Item not found'}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/lost-items')}
          >
            Back to Lost Items
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <LostItemDetails
        item={item}
        onMarkAsDone={handleMarkAsDone}   // ✅ Pass the handler
        onDelete={handleDelete}            // ✅ Pass the handler
        showActions={true}                // ✅ Explicitly enable actions
      />
    </div>
  );
};

export default LostItemDetailsPage;