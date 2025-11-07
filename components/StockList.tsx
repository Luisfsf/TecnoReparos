import React from 'react';
import { StockItem } from '../types';
import { PencilIcon, TrashIcon } from './icons';

interface StockListProps {
  items: StockItem[];
  onEdit: (item: StockItem) => void;
  onDelete: (itemId: string) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

const StockList: React.FC<StockListProps> = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nenhum item em estoque</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece cadastrando um novo item.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    SKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantidade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preço
                </th>
                <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-slate-400">{item.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-slate-100">{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                        {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-4">
                            <button onClick={() => onEdit(item)} className="text-gray-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" title="Editar">
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => onDelete(item.id)} className="text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-colors" title="Excluir">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
      </div>
    </div>
  );
};

export default StockList;
