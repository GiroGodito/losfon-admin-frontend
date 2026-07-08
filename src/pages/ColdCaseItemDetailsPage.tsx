// src/pages/ColdCaseItemDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coldCaseItemsApi } from '../api/cold-case-items';
import type { ColdCaseItem } from '../types/cold-case-item.types';
import { ColdCaseItemDetails } from '../components/cold-case-items/ColdCaseItemDetails';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { useToast } from '../hooks/useToast';

export const ColdCaseItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [item, setItem] = useState<ColdCaseItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await coldCaseItemsApi.getById(parseInt(id));
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
            onClick={() => navigate('/cold-case')}
          >
            Back to Cold Case
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ColdCaseItemDetails item={item} />
    </div>
  );
};