// src/pages/FoundItemsPage.tsx
import React, { useState } from 'react';
import { useFoundItems } from '../hooks/useFoundItems';
import { FoundItemList } from '../components/found-items/FoundItemList';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CreateFoundItemForm } from '../components/found-items/CreateFoundItemForm';
import { MarkAsClaimedForm } from '../components/found-items/MarkAsClaimedForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { PlusIcon } from '@heroicons/react/24/outline';

export const FoundItemsPage = () => {
  const {
    items,
    isLoading,
    pagination,
    markAsClaimed,
    deleteItem,
    goToPage,
    applyFilters,
    createFoundItem,
  } = useFoundItems({ 
    page: 1, 
    pageSize: 3
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { showToast } = useToast();

    const handleCreateFoundItem = async (data: {
    itemDescription: string;
    foundBy?: string;
    turnInBy: string;
    filePath?: string | null;
  }) => {
    try {
      await createFoundItem(data);
      setIsCreateModalOpen(false);
      showToast('Item added successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to add item', 'error');
    }
  };

  const handleMarkAsClaimed = (id: number) => {
    setSelectedItemId(id);
    setIsClaimModalOpen(true);
  };

  // ✅ This receives the data from the form
  const handleMarkAsClaimedSubmit = async (data: { 
    claimedBy: string; 
    releasedBy: string; 
    claimedContactInformation: string;
    userId?: number | null;
  }) => {
    console.log('🔍 MARK AS CLAIMED SUBMIT:', data);
    
    if (selectedItemId) {
      await markAsClaimed(selectedItemId, data);
      setIsClaimModalOpen(false);
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
          <h2 className="text-2xl font-bold text-white">Found Items</h2>
          <p className="text-gray-400 text-sm mt-1">Manage all found items</p>
        </div>
         <Button variant="glass-green" onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Found Item
        </Button>
      </div>

      <FoundItemList
        items={items}
        isLoading={isLoading}
        pagination={pagination}
        onMarkAsClaimed={handleMarkAsClaimed}
        onDelete={handleDelete}
        onFilter={applyFilters}
        onPageChange={goToPage}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Found Item"
        size="lg"
      >
        <CreateFoundItemForm
            onSubmit={handleCreateFoundItem}
        />
      </Modal>

      <Modal
        isOpen={isClaimModalOpen}
        onClose={() => {
          setIsClaimModalOpen(false);
          setSelectedItemId(null);
        }}
        title="Mark as Claimed"
        size="md"
      >
        <MarkAsClaimedForm
          onSubmit={handleMarkAsClaimedSubmit}
          onCancel={() => {
            setIsClaimModalOpen(false);
            setSelectedItemId(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Found Item"
        message="Are you sure you want to delete this found item? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};