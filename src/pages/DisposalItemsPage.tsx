// src/pages/DisposalItemsPage.tsx
import React, { useState } from 'react';
import { useDisposalItems } from '../hooks/useDisposalItems';
import { DisposalItemList } from '../components/disposal-items/DisposalItemList';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/common/Button';

export const DisposalItemsPage = () => {
  const {
    items,
    isLoading,
    pagination,
    deleteItem,
    goToPage,
    applyFilters,
    donateAll,
    restoreAll,
    markAllAsSeen,
  } = useDisposalItems();
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDonating, setIsDonating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDonateConfirm, setShowDonateConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
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

  const handleDonateAll = async () => {
    setIsDonating(true);
    await donateAll();
    setIsDonating(false);
    setShowDonateConfirm(false);
  };

  const handleRestoreAll = async () => {
    setIsRestoring(true);
    await restoreAll();
    setIsRestoring(false);
    setShowRestoreConfirm(false);
  };

  const handleMarkAllAsSeen = async () => {
    await markAllAsSeen();
    showToast('All disposal items marked as seen', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left"> {/* ✅ WRAP in div with text-left */}
          <h2 className="text-2xl font-bold text-white">Disposal Items</h2>
          <p className="text-gray-400 text-sm mt-1">Items pending disposal after 180 days</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="glass-green" size="sm" onClick={handleMarkAllAsSeen}>
            Mark All as Seen
          </Button>
          <Button variant="glass-green" size="sm" onClick={() => setShowDonateConfirm(true)}>
            Donate All
          </Button>
          {/* <Button variant="glass-green" size="sm" onClick={() => setShowRestoreConfirm(true)}>
            Restore All
          </Button> */}
        </div>
      </div>

      <DisposalItemList
        items={items}
        isLoading={isLoading}
        pagination={pagination}
        onDelete={handleDelete}
        onFilter={applyFilters}
        onPageChange={goToPage}
        isDonating={isDonating}
        isRestoring={isRestoring}
      />

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Disposal Item"
        message="Are you sure you want to delete this disposal item? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={showDonateConfirm}
        onClose={() => setShowDonateConfirm(false)}
        onConfirm={handleDonateAll}
        title="Donate All Items"
        message="Are you sure you want to donate all disposal items to charity? This action cannot be undone."
        confirmLabel="Donate All"
        variant="warning"
      />

      <ConfirmDialog
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={handleRestoreAll}
        title="Restore All Items"
        message="Are you sure you want to restore all donated items? This will move them back to disposal."
        confirmLabel="Restore All"
        variant="info"
      />
    </div>
  );
};