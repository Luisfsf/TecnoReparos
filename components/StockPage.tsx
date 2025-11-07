import React, { useState } from 'react';
import { StockItem } from '../types';
import StockList from './StockList';
import StockModal from './StockModal';
import { PlusIcon } from './icons';

interface StockPageProps {
  stockItems: StockItem[];
  addItem: (itemData: Omit<StockItem, 'id'>) => void;
  updateItem: (item: StockItem) => void;
  deleteItem: (itemId: string) => void;
}

const StockPage: React.FC<StockPageProps> = ({ stockItems, addItem, updateItem, deleteItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: StockItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = (itemData: Omit<StockItem, 'id'>, id?: string) => {
    if (id) {
        updateItem({ ...itemData, id });
    } else {
        addItem(itemData);
    }
    handleCloseModal();
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do estoque?')) {
      deleteItem(itemId);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Gerenciamento de Estoque</h1>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-500"
        >
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
          Adicionar Item
        </button>
      </div>
      <StockList
        items={stockItems}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteItem}
      />
      {isModalOpen && (
        <StockModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          itemToEdit={editingItem}
        />
      )}
    </div>
  );
};

export default StockPage;