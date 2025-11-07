// Fix: Implement the useStockItems custom hook.
import { useState, useCallback, useEffect } from 'react';
import { StockItem } from '../types';

const initialStockItems: StockItem[] = [
    { id: 'st1', name: 'Tela de iPhone 12', sku: 'IP12-SCR', quantity: 15, price: 550.00 },
    { id: 'st2', name: 'Bateria Samsung S20', sku: 'SAM20-BAT', quantity: 8, price: 250.00 },
    { id: 'st3', name: 'SSD 240GB Kingston', sku: 'KNG-SSD-240', quantity: 22, price: 180.50 },
    { id: 'st4', name: 'Memória RAM 8GB DDR4', sku: 'CRU-DDR4-8', quantity: 30, price: 210.00 },
];

const LOCAL_STORAGE_KEY = 'tecnoReparos-stockItems';

const getInitialStockState = (): StockItem[] => {
    try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (item) {
            return JSON.parse(item);
        }
    } catch (error) {
        console.warn(`Error reading stock items from localStorage`, error);
    }
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStockItems));
    return initialStockItems;
};


export const useStockItems = () => {
    const [stockItems, setStockItems] = useState<StockItem[]>(getInitialStockState);

    useEffect(() => {
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stockItems));
        } catch (error) {
            console.warn(`Error writing stock items to localStorage`, error);
        }
    }, [stockItems]);


    const addItem = useCallback((itemData: Omit<StockItem, 'id'>) => {
        const newItem: StockItem = {
            ...itemData,
            id: `${Date.now()}-${Math.random()}`,
        };
        setStockItems(prevItems => [newItem, ...prevItems].sort((a,b) => a.name.localeCompare(b.name)));
    }, []);

    const updateItem = useCallback((updatedItem: StockItem) => {
        setStockItems(prevItems =>
            prevItems.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
    }, []);

    const deleteItem = useCallback((itemId: string) => {
        setStockItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }, []);

    return { stockItems, addItem, updateItem, deleteItem };
};