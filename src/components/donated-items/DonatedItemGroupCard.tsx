// src/components/donated-items/DonatedItemGroupCard.tsx
import React, { useState } from 'react';
import type { DonatedItemGroup } from '../../types/donated-item.types';
import { Badge } from '../common/Badge';
import { DonatedItemCard } from './DonatedItemCard';
import { formatDate } from '../../lib/date';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon as ChevronRightIconSolid
} from '@heroicons/react/24/outline';
import Button from '../common/Button';

interface DonatedItemGroupCardProps {
  group: DonatedItemGroup;
}

const glassVariants = ['glass-green', 'glass-blue', 'glass-purple', 'glass-red', 'glass-grey'] as const;

export const DonatedItemGroupCard: React.FC<DonatedItemGroupCardProps> = ({ group }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // ✅ Use itemsPerPage from backend, fallback to 3
  const itemsPerPage = group.itemsPerPage || 3;
  const totalItems = group.itemCount || group.items.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // ✅ Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = group.items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ If no items, show empty state
  if (totalItems === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
        <div className="text-center text-gray-500 text-sm">
          No items donated on {formatDate(group.donationDate)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      {/* Header - Click to expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          )}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">
              {formatDate(group.donationDate)}
            </h3>
            <p className="text-sm text-gray-400">
              {totalItems} item{totalItems > 1 ? 's' : ''} donated
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 bg-gray-800/50 px-2.5 py-1 rounded-full border border-gray-700/50">
            {itemsPerPage} per page
          </span>
          <Badge variant="info">Donated</Badge>
        </div>
      </button>

      {/* Content - Only shown when expanded */}
      {isExpanded && (
        <div className="border-t border-gray-800 p-4">
          {/* ✅ GRID LAYOUT - Side by side items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-sm py-4">
                No items on this page
              </div>
            ) : (
              currentItems.map((item, index) => (
                <DonatedItemCard 
                  key={item.id} 
                  item={item} 
                  rowNumber={startIndex + index + 1}
                  variant={glassVariants[(startIndex + index) % glassVariants.length]}
                />
              ))
            )}
          </div>

          {/* ✅ PAGINATION INSIDE GROUP - Same style as outer pagination */}
          {totalPages > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-800/60">
              <div className="bg-gray-900/20 backdrop-blur-sm rounded-xl border border-gray-800/40 p-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Left: Items per page info */}
                  <div className="text-xs text-gray-500">
                    {itemsPerPage} items per page
                  </div>

                  {/* Center: Pagination controls - <- 1 of x pages -> style */}
                  <div className="flex items-center gap-3">
                    {/* Previous Button */}
                    <Button
                      variant="glass-grey"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`
                        p-1.5 rounded-lg transition-all
                        ${currentPage === 1 
                          ? 'text-gray-600 cursor-not-allowed' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
                      `}
                      aria-label="Previous page"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </Button>

                    {/* Page indicator: "1 of 2 pages" style */}
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <span className="font-medium text-white">{currentPage}</span>
                      <span className="mx-0.5">of</span>
                      <span className="font-medium text-white">{totalPages}</span>
                    </div>

                    {/* Next Button */}
                    <Button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`
                        p-1.5 rounded-lg transition-all
                        ${currentPage === totalPages 
                          ? 'text-gray-600 cursor-not-allowed' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
                      `}
                      aria-label="Next page"
                      variant="glass-grey"
                    >
                      <ChevronRightIconSolid className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Right: Showing info */}
                  <div className="text-xs text-gray-500 text-right">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonatedItemGroupCard;