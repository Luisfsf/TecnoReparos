import React from 'react';

interface IdleTimeoutModalProps {
  isOpen: boolean;
  remainingTime: number;
  onStayActive: () => void;
  onLogout: () => void;
}

const IdleTimeoutModal: React.FC<IdleTimeoutModalProps> = ({ isOpen, remainingTime, onStayActive, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="idle-modal-title">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 text-center">
        <h2 id="idle-modal-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Você ainda está aí?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Sua sessão será encerrada automaticamente por inatividade em{' '}
          <span className="font-bold text-slate-900 dark:text-white">{remainingTime}</span> segundos.
        </p>
        <div className="flex justify-center space-x-4">
            <button 
                onClick={onLogout} 
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600"
            >
              Sair
            </button>
            <button 
                onClick={onStayActive} 
                className="px-6 py-2 bg-slate-700 text-white border border-transparent rounded-md hover:bg-slate-800 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Continuar Sessão
            </button>
        </div>
      </div>
    </div>
  );
};

export default IdleTimeoutModal;
