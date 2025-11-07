// Fix: Create the DashboardPage component to serve as the main application layout.
import React, { useState, useMemo, useCallback } from 'react';
import Header from './Header';
import StockPage from './StockPage';
import ServiceOrderList from './ServiceOrderList';
import ServiceOrderModal from './ServiceOrderModal';
import IdleTimeoutModal from './IdleTimeoutModal';
import { useServiceOrders } from '../hooks/useServiceOrders';
import { useStockItems } from '../hooks/useStockItems';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import { ServiceOrder, Status } from '../types';
import { PlusIcon, MagnifyingGlassIcon } from './icons';

export type View = 'orders' | 'stock';

interface DashboardPageProps {
  user: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, theme, onThemeToggle }) => {
  const [currentView, setCurrentView] = useState<View>('orders');

  // State and logic for Service Orders
  const { serviceOrders, addOrder, updateOrder, deleteOrder } = useServiceOrders();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');


  // State and logic for Stock Items (State is now lifted to this component)
  const { stockItems, addItem: addStockItem, updateItem: updateStockItem, deleteItem: deleteStockItem } = useStockItems();

  // RNF02 - Auto-logout on inactivity
  const { isPromptVisible, remainingTime, stayActive } = useIdleTimeout({
    onIdle: onLogout,
    idleTimeout: 15 * 60 * 1000, // 15 minutes
    promptTimeout: 30 * 1000, // 30 seconds
  });


  const handleOpenCreateOrderModal = () => {
    setEditingOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleOpenEditOrderModal = useCallback((order: ServiceOrder) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  }, []);

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  const handleSaveOrder = (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => {
    if (id && editingOrder) {
        const updatedOrder: ServiceOrder = {
            ...editingOrder, // keep original createdAt
            ...orderData, // apply changes
            id: id,
        };
        updateOrder(updatedOrder);
    } else {
        addOrder(orderData);
    }
    handleCloseOrderModal();
  };
  
  const handleDeleteOrder = useCallback((orderId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      deleteOrder(orderId);
    }
  }, [deleteOrder]);
  
  const filteredAndSortedOrders = useMemo(() => {
    let result = serviceOrders;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.clientName.toLowerCase().includes(lowercasedTerm) ||
        order.device.toLowerCase().includes(lowercasedTerm) ||
        order.id.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [serviceOrders, searchTerm, statusFilter, sortOrder]);


  const renderServiceOrdersPage = () => (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Ordens de Serviço</h1>
        <button
          onClick={handleOpenCreateOrderModal}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-500 w-full sm:w-auto"
        >
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
          Nova Ordem
        </button>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Buscar por cliente, O.S., aparelho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select
            id="statusFilter"
            name="statusFilter"
            className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="in-progress">Em Progresso</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div className="flex-shrink-0">
          <select
            id="sortOrder"
            name="sortOrder"
            className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
          </select>
        </div>
      </div>
      
      <ServiceOrderList
        orders={filteredAndSortedOrders}
        onEdit={handleOpenEditOrderModal}
        onDelete={handleDeleteOrder}
        onViewDetails={handleOpenEditOrderModal} // For simplicity, edit and view details open the same modal
      />
      {isOrderModalOpen && (
        <ServiceOrderModal
          isOpen={isOrderModalOpen}
          onClose={handleCloseOrderModal}
          onSave={handleSaveOrder}
          orderToEdit={editingOrder}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <Header 
        user={user} 
        onLogout={onLogout} 
        theme={theme} 
        onThemeToggle={onThemeToggle}
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {currentView === 'orders' && renderServiceOrdersPage()}
            {currentView === 'stock' && (
              <StockPage 
                stockItems={stockItems}
                addItem={addStockItem}
                updateItem={updateStockItem}
                deleteItem={deleteStockItem}
              />
            )}
        </div>
      </main>
      <IdleTimeoutModal 
        isOpen={isPromptVisible}
        remainingTime={remainingTime}
        onStayActive={stayActive}
        onLogout={onLogout}
      />
    </div>
  );
};

export default DashboardPage;