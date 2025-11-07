import React, { useState, useCallback, useLayoutEffect } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

type Theme = 'light' | 'dark';

// More robust function to get the initial theme from localStorage or system settings.
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const storedTheme = localStorage.getItem('theme');
  // Only use the stored theme if it's one of the valid values.
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  
  // Otherwise, fall back to the user's system preference.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const App: React.FC = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);
  // Use the lazy initializer for state to run `getInitialTheme` only once on mount.
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // This effect syncs the theme state with the DOM (by adding/removing the 'dark' class)
  // and persists the choice to localStorage. It runs whenever 'theme' changes.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // A memoized function to toggle the theme state.
  const handleThemeToggle = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);


  const handleLogin = useCallback((username: string) => {
    setAuthenticatedUser(username);
  }, []);

  const handleLogout = useCallback(() => {
    setAuthenticatedUser(null);
  }, []);

  if (!authenticatedUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Pass the current theme and the toggle function down to the dashboard.
  return <DashboardPage user={authenticatedUser} onLogout={handleLogout} theme={theme} onThemeToggle={handleThemeToggle} />;
};

export default App;
