// // src/pages/ClaimedItemDetailsPage.tsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { claimedItemsApi } from '../api/claimed-items';
// import type { ClaimedItem } from '../types/claimed-item.types';
// import { ClaimedItemDetails } from '../components/claimed-items/ClaimedItemDetails';
// import { Spinner } from '../components/common/Spinner';
// import { Button } from '../components/common/Button';
// import { useToast } from '../hooks/useToast';

// export const ClaimedItemDetailsPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [item, setItem] = useState<ClaimedItem | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchItem = async () => {
//       if (!id) return;
//       setIsLoading(true);
//       try {
//         const data = await claimedItemsApi.getById(parseInt(id));
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
//             onClick={() => navigate('/claimed-items')}
//           >
//             Back to Claimed Items
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4">
//       <ClaimedItemDetails item={item} />
//     </div>
//   );
// };
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foundItemsApi } from '../api/found-items';
import {claimedItemsApi} from '../api/claimed-items';
import type { ClaimedItem } from '../types/claimed-item.types';
import { ClaimedItemDetails } from '../components/claimed-items/ClaimedItemDetails';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { useToast } from '../hooks/useToast';

export const ClaimedItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [item, setItem] = useState<ClaimedItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await claimedItemsApi.getById(parseInt(id));
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

  // ✅ Undo Mark as Claimed – reverts to Found Item
  // const handleUndoMarkAsClaimed = async (id: number) => {
  //   if (!item?.sourceFoundItemId) {
  //     showToast('This claimed item has no associated found item to undo.', 'error');
  //     return;
  //   }
  //   try {
  //     const response = await foundItemsApi.undoMarkAsClaimed(item.sourceFoundItemId);
  //     if (response.success) {
  //       showToast(response.message || 'Undo successful – item moved back to Found Items', 'success');
  //       navigate('/found-items');
  //     } else {
  //       showToast(response.message || 'Undo failed', 'error');
  //     }
  //   } catch (error: any) {
  //     showToast(error.message || 'Undo failed', 'error');
  //   }
  // };

  // const handleDelete = async (id: number) => {
  //   try {
  //     await claimedItemsApi.delete(id);
  //     showToast('Claim record deleted successfully', 'success');
  //     navigate('/claimed-items');
  //   } catch (error: any) {
  //     showToast(error.message || 'Failed to delete claim record', 'error');
  //   }
  // };

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
          <Button variant="outline" className="mt-4" onClick={() => navigate('/claimed-items')}>
            Back to Claimed Items
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ClaimedItemDetails
        item={item}
        // onUndoMarkAsClaimed={handleUndoMarkAsClaimed}   // ✅ Pass undo handler
        // onDelete={handleDelete}
        showActions={true}
      />
    </div>
  );
};

export default ClaimedItemDetailsPage;