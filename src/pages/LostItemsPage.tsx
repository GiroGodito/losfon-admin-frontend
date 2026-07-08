// src/pages/LostItemsPage.tsx
import { useState } from 'react';
import { useLostItems } from '../hooks/useLostItems';
import { useSignalR } from '../hooks/useSignalR';
import { LostItemList } from '../components/lost-items/LostItemList';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CreateLostItemForm } from '../components/lost-items/CreateLostItemForm';
import { MarkAsFoundForm } from '../components/lost-items/MarkAsFoundForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { PlusIcon } from '@heroicons/react/24/outline';

export const LostItemsPage = () => {
  const {
    items,
    isLoading,
    pagination,
    markAsDone,
    deleteItem,
    goToPage,
    applyFilters,
    refetch,
    createLostItem, // ✅ ADD THIS
  } = useLostItems({ 
    page: 1, 
    pageSize: 3
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMarkFoundModalOpen, setIsMarkFoundModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { showToast } = useToast();

  // ✅ HANDLE NEW LOST ITEM (SignalR)
  const handleNewLostItem = (data: any) => {
    console.log('📨 New lost item reported, refreshing list...');
    refetch();
    showToast(`New lost item reported: ${data.itemDescription}`, 'info');
  };

  // ✅ HANDLE CANCELLED LOST ITEM (SignalR)
  const handleLostItemCancelled = (data: any) => {
    console.log('❌ Lost item cancelled, refreshing list...');
    refetch();
    showToast(`Lost item cancelled: ${data.itemDescription}`, 'info');
  };

  // ✅ Use the hook with BOTH callbacks
  useSignalR(handleNewLostItem, handleLostItemCancelled);

  // ✅ CREATE LOST ITEM - Proper handler that calls the API
  const handleCreateLostItem = async (data: {
    itemDescription: string;
    reportedBy?: string;
    contactNumber?: string;
    filePath?: string | null;
    userId?: number | null;
  }) => {
    try {
      await createLostItem(data);
      setIsCreateModalOpen(false);
      showToast('Item reported successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to report item', 'error');
    }
  };

  const handleMarkAsDone = (id: number) => {
    setSelectedItemId(id);
    setIsMarkFoundModalOpen(true);
  };

  const handleMarkAsFoundSubmit = async (data: { turnInBy?: string; foundBy?: string; filePath?: string }) => {
    if (selectedItemId) {
      await markAsDone(selectedItemId, data);
      setIsMarkFoundModalOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-white">Lost Items</h2>
          <p className="text-gray-400 text-sm mt-1">Manage all lost items</p>
        </div>
        {/* ✅ UNCOMMENT THIS BUTTON */}
        <Button variant="glass-green" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Lost Item
        </Button>
      </div>

      <LostItemList
        items={items}
        isLoading={isLoading}
        pagination={pagination}
        onMarkAsDone={handleMarkAsDone}
        onDelete={handleDelete}
        onFilter={applyFilters}
        onPageChange={goToPage}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Report Lost Item"
        size="2xl"
        maxHeight="85vh"
      >
        <CreateLostItemForm
          onSubmit={handleCreateLostItem} // ✅ CHANGE THIS
        />
      </Modal>

      <Modal
        isOpen={isMarkFoundModalOpen}
        onClose={() => {
          setIsMarkFoundModalOpen(false);
          setSelectedItemId(null);
        }}
        title="Mark as Found"
        size="md"
      >
        <MarkAsFoundForm
          onSubmit={handleMarkAsFoundSubmit}
          onCancel={() => {
            setIsMarkFoundModalOpen(false);
            setSelectedItemId(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Lost Item"
        message="Are you sure you want to delete this lost item report? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};