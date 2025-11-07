// Fix: Create the ServiceOrderCard component.
import React from 'react';
import { ServiceOrder, Status } from '../types';
import { PencilIcon, TrashIcon, CameraIcon } from './icons';

interface ServiceOrderCardProps {
  order: ServiceOrder;
  onEdit: (order: ServiceOrder) => void;
  onDelete: (orderId: string) => void;
  onViewDetails: (order: ServiceOrder) => void;
}

const statusStyles: Record<Status, { bg: string, text: string, label: string }> = {
    pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-300', label: 'Pendente' },
    'in-progress': { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300', label: 'Em Progresso' },
    completed: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300', label: 'Concluído' },
    cancelled: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-300', label: 'Cancelado' },
};

const ServiceOrderCard: React.FC<ServiceOrderCardProps> = ({ order, onEdit, onDelete, onViewDetails }) => {
  const { bg, text, label } = statusStyles[order.status];
  const imageCount = order.images?.length || 0;

  return (
    <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
        onClick={() => onViewDetails(order)}
        onKeyPress={(e) => e.key === 'Enter' && onViewDetails(order)}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes da ordem de ${order.clientName}`}
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 pr-2">{order.clientName}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
                {label}
            </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{order.device}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-3">
          {order.issueDescription}
        </p>
      </div>
       <div className="border-t border-gray-200 dark:border-slate-700/50 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-b-lg flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                  OS #{order.id.substring(0, 5)}...
              </p>
              {imageCount > 0 && (
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400" title={`${imageCount} imagem(s) anexada(s)`}>
                  <CameraIcon className="h-4 w-4 mr-1" />
                  <span>{imageCount}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(order); }} 
                    className="text-gray-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" 
                    aria-label={`Editar Ordem de Serviço de ${order.clientName}`}
                >
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(order.id); }} 
                    className="text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-colors" 
                    aria-label={`Excluir Ordem de Serviço de ${order.clientName}`}
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default React.memo(ServiceOrderCard);