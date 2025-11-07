// Fix: Implement the useServiceOrders custom hook.
import { useState, useCallback, useEffect } from 'react';
import { ServiceOrder } from '../types';

const initialServiceOrders: ServiceOrder[] = [
    {
        id: '1',
        clientName: 'João Silva',
        device: 'Laptop Dell Inspiron 15',
        issueDescription: 'Não liga, sem sinal de energia.',
        status: 'pending',
        createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
        updatedAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    },
    {
        id: '2',
        clientName: 'Maria Oliveira',
        device: 'iPhone 12 Pro',
        issueDescription: 'Tela quebrada após queda.',
        status: 'in-progress',
        createdAt: new Date('2023-10-25T14:30:00Z').toISOString(),
        updatedAt: new Date('2023-10-27T11:00:00Z').toISOString(),
    },
    {
        id: '3',
        clientName: 'Carlos Pereira',
        device: 'Samsung Galaxy S21',
        issueDescription: 'Bateria não segura carga.',
        status: 'completed',
        createdAt: new Date('2023-10-20T09:00:00Z').toISOString(),
        updatedAt: new Date('2023-10-24T17:00:00Z').toISOString(),
    },
];

const LOCAL_STORAGE_KEY = 'tecnoReparos-serviceOrders';

const getInitialState = (): ServiceOrder[] => {
    try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (item) {
            return JSON.parse(item);
        }
    } catch (error) {
        console.warn('Error reading service orders from localStorage', error);
    }
    // If localStorage is empty or fails, use initial mock data and save it.
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialServiceOrders));
    return initialServiceOrders;
};


export const useServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(getInitialState);

  useEffect(() => {
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serviceOrders));
    } catch (error) {
        console.warn('Error writing service orders to localStorage', error);
    }
  }, [serviceOrders]);


  const addOrder = useCallback((orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: ServiceOrder = {
      ...orderData,
      id: `${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setServiceOrders(prevOrders => [newOrder, ...prevOrders]);
  }, []);

  const updateOrder = useCallback((updatedOrder: ServiceOrder) => {
    setServiceOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === updatedOrder.id ? { ...updatedOrder, updatedAt: new Date().toISOString() } : order
      )
    );
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setServiceOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  }, []);

  return { serviceOrders, addOrder, updateOrder, deleteOrder };
};