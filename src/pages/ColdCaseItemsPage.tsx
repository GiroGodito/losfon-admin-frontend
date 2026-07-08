// src/pages/ColdCaseItemsPage.tsx
import React, { useState } from 'react';
import { useColdCaseItems } from '../hooks/useColdCaseItems';
import { ColdCaseItemList } from '../components/cold-case-items/ColdCaseItemList';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { MarkAsFoundFromColdCaseForm } from '../components/cold-case-items/MarkAsFoundFromColdCaseForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';

export const ColdCaseItemsPage = () => {
  const {
    items,
    isLoading,
    pagination,
    markAsFound,
    deleteItem,
    goToPage,
    applyFilters,
    markAllAsSeen,
  } = useColdCaseItems();
  const [isMarkFoundModalOpen, setIsMarkFoundModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleMarkAsFound = (id: number) => {
    setSelectedItemId(id);
    setIsMarkFoundModalOpen(true);
  };

  const handleMarkAsFoundSubmit = async (data: { turnInBy?: string; foundBy?: string; filePath?: string }) => {
    if (selectedItemId) {
      await markAsFound(selectedItemId, data);
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

  const handleMarkAllAsSeen = async () => {
    await markAllAsSeen();
    showToast('All cold case items marked as seen', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left"> {/* ✅ WRAP in div with text-left */}
          <h2 className="text-2xl font-bold text-white">Cold Case Items</h2>
          <p className="text-gray-400 text-sm mt-1">Items that have been in the system for over 180 days</p>
        </div>
        <Button variant="glass-green" onClick={handleMarkAllAsSeen}>
          Mark All as Seen
        </Button>
      </div>

      <ColdCaseItemList
        items={items}
        isLoading={isLoading}
        pagination={pagination}
        onMarkAsFound={handleMarkAsFound}
        onDelete={handleDelete}
        onFilter={applyFilters}
        onPageChange={goToPage}
      />

      <Modal
        isOpen={isMarkFoundModalOpen}
        onClose={() => {
          setIsMarkFoundModalOpen(false);
          setSelectedItemId(null);
        }}
        title="Mark Cold Case Item as Found"
        size="md"
      >
        <MarkAsFoundFromColdCaseForm
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
        title="Delete Cold Case Item"
        message="Are you sure you want to delete this cold case item? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};