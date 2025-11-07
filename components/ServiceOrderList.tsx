// Fix: Create the ServiceOrderList component.
import React from 'react';
import { ServiceOrder } from '../types';
import ServiceOrderCard from './ServiceOrderCard';

interface ServiceOrderListProps {
  orders: ServiceOrder[];
  onEdit: (order: ServiceOrder) => void;
  onDelete: (orderId: string) => void;
  onViewDetails: (order: ServiceOrder) => void;
}

const ServiceOrderList: React.FC<ServiceOrderListProps> = ({ orders, onEdit, onDelete, onViewDetails }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nenhuma Ordem de Serviço Encontrada</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Crie uma nova ordem de serviço para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <ServiceOrderCard
          key={order.id}
          order={order}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default ServiceOrderList;
