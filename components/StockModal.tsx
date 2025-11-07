import React, { useState, useEffect, FormEvent } from 'react';
import { StockItem } from '../types';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<StockItem, 'id'>, id?: string) => void;
  itemToEdit: StockItem | null;
}

const StockModal: React.FC<StockModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setSku(itemToEdit.sku);
      setQuantity(String(itemToEdit.quantity));
      setPrice(String(itemToEdit.price));
    } else {
      setName('');
      setSku('');
      setQuantity('');
      setPrice('');
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const itemData = {
        name,
        sku,
        quantity: parseInt(quantity, 10) || 0,
        price: parseFloat(price.replace(',', '.')) || 0,
    }
    onSave(itemData, itemToEdit?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              {itemToEdit ? 'Editar Item do Estoque' : 'Novo Item no Estoque'}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome do Item</label>
                <input type="text" id="itemName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-slate-300">SKU (Código)</label>
                <input type="text" id="sku" value={sku} onChange={e => setSku(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Quantidade</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                 <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Preço (R$)</label>
                    <input type="text" id="price" placeholder="123,45" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-slate-700 text-white border border-transparent rounded-md hover:bg-slate-800 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700">
              {itemToEdit ? 'Salvar Alterações' : 'Adicionar Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockModal;
