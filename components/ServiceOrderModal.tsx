// Fix: Create the ServiceOrderModal component.
import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { ServiceOrder, Status } from '../types';
import { XCircleIcon } from './icons';

interface ServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  orderToEdit: ServiceOrder | null;
}

const statusOptions: { value: Status; label: string }[] = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in-progress', label: 'Em Progresso' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' },
];

const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({ isOpen, onClose, onSave, orderToEdit }) => {
  const [clientName, setClientName] = useState('');
  const [device, setDevice] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [status, setStatus] = useState<Status>('pending');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (orderToEdit) {
      setClientName(orderToEdit.clientName);
      setDevice(orderToEdit.device);
      setIssueDescription(orderToEdit.issueDescription);
      setStatus(orderToEdit.status);
      setImages(orderToEdit.images || []);
    } else {
      setClientName('');
      setDevice('');
      setIssueDescription('');
      setStatus('pending');
      setImages([]);
    }
  }, [orderToEdit, isOpen]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    // Simple check to avoid overloading localStorage
    if (images.length + files.length > 5) {
        alert("Você pode anexar no máximo 5 imagens.");
        return;
    }

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                newImages.push(e.target.result);
                if (newImages.length === files.length) {
                    setImages(prev => [...prev, ...newImages]);
                }
            }
        };
        reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const orderData = {
        clientName,
        device,
        issueDescription,
        status,
        images,
    };
    onSave(orderData, orderToEdit?.id);
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex justify-center items-start p-4 transition-opacity overflow-y-auto"
        onClick={onClose}
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 id="modal-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              {orderToEdit ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Nome do Cliente</label>
                <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
               <div>
                <label htmlFor="device" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Equipamento</label>
                <input type="text" id="device" value={device} onChange={e => setDevice(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Descrição do Problema</label>
                <textarea id="issueDescription" value={issueDescription} onChange={e => setIssueDescription(e.target.value)} required rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Imagens</label>
                <div className="mt-1 flex items-center flex-wrap gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <img src={image} alt={`Preview ${index + 1}`} className="h-20 w-20 rounded-md object-cover" />
                            <button 
                                type="button" 
                                onClick={() => handleRemoveImage(index)} 
                                className="absolute -top-2 -right-2 bg-white dark:bg-slate-600 rounded-full text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                aria-label="Remover imagem"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-20 w-20 bg-gray-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        >
                        <span className="text-xs text-center">Adicionar Imagens</span>
                    </button>
                    <input
                        type="file"
                        id="images"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>
              </div>
               <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Status</label>
                  <select id="status" value={status} onChange={e => setStatus(e.target.value as Status)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                  </select>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-slate-700 text-white border border-transparent rounded-md hover:bg-slate-800 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700">
              {orderToEdit ? 'Salvar Alterações' : 'Criar Ordem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceOrderModal;