// // src/pages/FoundItemDetailsPage.tsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { foundItemsApi } from '../api/found-items';
// import type { FoundItem } from '../types/found-item.types';
// import { FoundItemDetails } from '../components/found-items/FoundItemDetails';
// import { Spinner } from '../components/common/Spinner';
// import { Button } from '../components/common/Button';
// import { useToast } from '../hooks/useToast';

// export const FoundItemDetailsPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [item, setItem] = useState<FoundItem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchItem = async () => {
//       if (!id) return;
//       setIsLoading(true);
//       try {
//         const data = await foundItemsApi.getById(parseInt(id));
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
//             onClick={() => navigate('/found-items')}
//           >
//             Back to Found Items
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <FoundItemDetails item={item} />
//     </div>
//   );
// };
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lostItemsApi } from '../api/lost-items';
import {foundItemsApi} from '../api/found-items';
import type { FoundItem } from '../types/found-item.types';
import { FoundItemDetails } from '../components/found-items/FoundItemDetails';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { useToast } from '../hooks/useToast';

export const FoundItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [item, setItem] = useState<FoundItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await foundItemsApi.getById(parseInt(id));
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

  // Mark as Claimed – stub (actual flow via modal in list page)
  const handleMarkAsClaimed = async (id: number) => {};

  // ✅ Undo Mark as Found – reverts to Lost Item (using sourceLostItemId)
  // const handleUndoMarkAsFound = async (id: number) => {
  //   if (!item?.sourceLostItemId) {
  //     showToast('This found item has no associated lost item to undo.', 'error');
  //     return;
  //   }
  //   try {
  //     const response = await lostItemsApi.undoMarkAsDone(item.sourceLostItemId);
  //     if (response.success) {
  //       showToast(response.message || 'Undo successful – item moved back to Lost Items', 'success');
  //       navigate('/lost-items');
  //     } else {
  //       showToast(response.message || 'Undo failed', 'error');
  //     }
  //   } catch (error: any) {
  //     showToast(error.message || 'Undo failed', 'error');
  //   }
  // };

  const handleDelete = async (id: number) => {
    try {
      await foundItemsApi.delete(id);
      showToast('Item deleted successfully', 'success');
      navigate('/found-items');
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
          <Button variant="outline" className="mt-4" onClick={() => navigate('/found-items')}>
            Back to Found Items
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <FoundItemDetails
        item={item}
        onMarkAsClaimed={handleMarkAsClaimed}
        // onUndoMarkAsFound={handleUndoMarkAsFound}   // ✅ Pass undo handler
        onDelete={handleDelete}
        showActions={true}
      />
    </div>
  );
};

export default FoundItemDetailsPage;