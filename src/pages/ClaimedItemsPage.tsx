// src/pages/ClaimedItemsPage.tsx
import { useState } from 'react';
import { useClaimedItems } from '../hooks/useClaimedItems';
import { ClaimedItemList } from '../components/claimed-items/ClaimedItemList';
import { Modal } from '../components/common/Modal';
import { CreateClaimedItemForm } from '../components/claimed-items/CreateClaimedItemForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export const ClaimedItemsPage = () => {
  const {
    items,
    isLoading,
    pagination,
    deleteItem,
    goToPage,
    applyFilters,
  } = useClaimedItems();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { showToast } = useToast();

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
        <div className="text-left"> {/* ✅ WRAP in div with text-left */}
          <h2 className="text-2xl font-bold text-white">Claimed Items</h2>
          <p className="text-gray-400 text-sm mt-1">Manage all claimed items</p>
        </div>
        {/* <Button variant="glass-green" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Claimed Item
        </Button> */}
      </div>

      <ClaimedItemList
        items={items}
        isLoading={isLoading}
        pagination={pagination}
        onDelete={handleDelete}
        onFilter={applyFilters}
        onPageChange={goToPage}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Claimed Item"
        size="lg"
      >
        <CreateClaimedItemForm
          onSubmit={async () => {
            setIsCreateModalOpen(false);
            showToast('Item added successfully', 'success');
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Claimed Item"
        message="Are you sure you want to delete this claimed item record? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};