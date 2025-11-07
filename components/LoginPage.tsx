import React, { useState, FormEvent } from 'react';
import { WrenchScrewdriverIcon } from './icons';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    if (username === 'tecnico' && password === '123') {
      setError('');
      onLogin(username);
    } else {
      setError('Usuário ou senha inválidos. (tente: tecnico / 123)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
        <div className="text-center">
            <WrenchScrewdriverIcon className="w-16 h-16 mx-auto text-slate-700 dark:text-slate-300"/>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            TecnoReparos
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
            Acesse o painel de Ordens de Serviço
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-500"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;