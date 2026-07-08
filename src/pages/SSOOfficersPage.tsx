// // src/pages/SSOOfficersPage.tsx
// import React, { useState, useEffect } from 'react';
// import { useOfficers } from '../hooks/useOfficers';
// import { OfficerList } from '../components/sso-officers/OfficerList';
// import { Modal } from '../components/common/Modal';
// import { OfficerForm } from '../components/sso-officers/OfficerForm';
// import type { SSOfficer } from '../types/sso-officer.types';
// import { usePrintSettings } from '../hooks/usePrintSettings';
// import { Button } from '../components/common/Button';
// import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';

// export const SSOOfficersPage = () => {
//   const {
//     officers,
//     isLoading,
//     pagination,
//     createOfficer,
//     updateOfficer,
//     deleteOfficer,
//     goToPage,
//     applyFilters,
//     fetchOfficers,
//   } = useOfficers();
//   const { defaultOfficer } = usePrintSettings();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingOfficer, setEditingOfficer] = useState<SSOfficer | null>(null);

//   useEffect(() => {
//     console.log('📋 Officers updated in page:', officers);
//   }, [officers]);

//   useEffect(() => {
//     fetchOfficers();
//   }, []);

//   const handleAdd = () => {
//     setEditingOfficer(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (officer: SSOfficer) => {
//     setEditingOfficer(officer);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (data: { firstName: string; lastName: string; contactInformation: string }) => {
//     try {
//       if (editingOfficer) {
//         await updateOfficer({ id: editingOfficer.id, ...data });
//       } else {
//         await createOfficer(data);
//       }
//       setIsModalOpen(false);
//       setEditingOfficer(null);
//     } catch (error) {
//       console.error('Submit error:', error);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteOfficer(id);
//     } catch (error) {
//       console.error('Delete error:', error);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* ✅ ONE CONTAINER: Title, Description, and Button ALL together */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         {/* Left side: Icon + Title + Description (stacked vertically) */}
//         <div className="flex items-start gap-2">
//           <div>
//             <h2 className="text-2xl font-bold text-white text-left">SSO Officers</h2>
//             <p className="text-gray-400 text-sm">Manage SSO officers who handle lost and found items</p>
//           </div>
//         </div>

//         {/* Right side: Add Button */}
//         <Button variant="glass-green" onClick={handleAdd} className="flex-shrink-0">
//           <PlusIcon className="w-4 h-4 mr-2" />
//           Add Officer
//         </Button>
//       </div>

//       <OfficerList
//         officers={officers}
//         isLoading={isLoading}
//         pagination={pagination}
//         defaultOfficerId={defaultOfficer?.officerId}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         onAdd={undefined}
//         onFilter={applyFilters}
//         onPageChange={goToPage}
//       />

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditingOfficer(null);
//         }}
//         title={editingOfficer ? 'Edit Officer' : 'Add Officer'}
//         size="md"
//       >
//         <OfficerForm
//           initialData={editingOfficer || undefined}
//           onSubmit={handleSubmit}
//           onCancel={() => {
//             setIsModalOpen(false);
//             setEditingOfficer(null);
//           }}
//         />
//       </Modal>
//     </div>
//   );
// };
// src/pages/SSOOfficersPage.tsx
import { useState, useEffect } from 'react';
import { useOfficers } from '../hooks/useOfficers';
import { OfficerList } from '../components/sso-officers/OfficerList';
import { Modal } from '../components/common/Modal';
import { OfficerForm } from '../components/sso-officers/OfficerForm';
import type { SSOfficer } from '../types/sso-officer.types';
import { usePrintSettings } from '../hooks/usePrintSettings';
import { Button } from '../components/common/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

export const SSOOfficersPage = () => {
  const {
    officers,
    isLoading,
    pagination,
    createOfficer,
    updateOfficer,
    deleteOfficer,
    goToPage,
    applyFilters,
    fetchOfficers,
  } = useOfficers();
  const { defaultOfficer } = usePrintSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<SSOfficer | null>(null);

  useEffect(() => {
    console.log('📋 Officers updated in page:', officers);
  }, [officers]);

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleAdd = () => {
    setEditingOfficer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (officer: SSOfficer) => {
    setEditingOfficer(officer);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: { firstName: string; lastName: string; contactInformation: string }) => {
    try {
      if (editingOfficer) {
        await updateOfficer({ id: editingOfficer.id, ...data });
      } else {
        await createOfficer(data);
      }
      setIsModalOpen(false);
      setEditingOfficer(null);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOfficer(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* ONE CONTAINER: Title, Description, and Button ALL together */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left side: Icon + Title + Description (stacked vertically) */}
        <div className="flex items-start gap-2">
          <div>
            <h2 className="text-2xl font-bold text-white text-left">SSO Officers</h2>
            <p className="text-gray-400 text-sm">Manage SSO officers who handle lost and found items</p>
          </div>
        </div>

        {/* Right side: Add Button */}
        <Button variant="glass-green" onClick={handleAdd} className="flex-shrink-0">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Officer
        </Button>
      </div>

      <OfficerList
        officers={officers}
        isLoading={isLoading}
        pagination={pagination}
        defaultOfficerId={defaultOfficer?.officerId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={undefined}
        onFilter={applyFilters}
        onPageChange={goToPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOfficer(null);
        }}
        title={editingOfficer ? 'Edit Officer' : 'Add Officer'}
        size="md"
      >
        <OfficerForm
          initialData={editingOfficer || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingOfficer(null);
          }}
        />
      </Modal>
    </div>
  );
};