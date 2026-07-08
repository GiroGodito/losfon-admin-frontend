// src/pages/DonatedItemsPage.tsx
import { useDonatedItems } from '../hooks/useDonatedItems';
import { DonatedItemList } from '../components/donated-items/DonatedItemList';

export const DonatedItemsPage = () => {
  const {
    items,
    groups,
    isLoading,
    pagination,
    goToPage,
    applyFilters,
  } = useDonatedItems();

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Donated Items
        </h2>
        <p className="text-gray-400 text-sm mt-1">Items that have been donated to charity</p>
      </div>

      <DonatedItemList
        items={items}
        groups={groups}
        isLoading={isLoading}
        pagination={pagination}
        onFilter={applyFilters}
        onPageChange={goToPage}
        grouped={true}  // ✅ Display as groups
      />
    </div>
  );
};