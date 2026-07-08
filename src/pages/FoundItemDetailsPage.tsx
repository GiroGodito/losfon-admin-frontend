// src/pages/FoundItemDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foundItemsApi } from '../api/found-items';
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
            onClick={() => navigate('/found-items')}
          >
            Back to Found Items
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <FoundItemDetails item={item} />
    </div>
  );
};