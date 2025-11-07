import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIdleTimeoutProps {
  onIdle: () => void;
  idleTimeout: number; // in milliseconds
  promptTimeout: number; // in milliseconds
}

export const useIdleTimeout = ({
  onIdle,
  idleTimeout,
  promptTimeout,
}: UseIdleTimeoutProps) => {
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(promptTimeout / 1000);

  const idleTimer = useRef<number | null>(null);
  const promptTimer = useRef<number | null>(null);
  const countdownInterval = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (promptTimer.current) clearTimeout(promptTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  }, []);

  const handleIdle = useCallback(() => {
    onIdle();
    setIsPromptVisible(false);
    clearTimers();
  }, [onIdle, clearTimers]);

  const showPrompt = useCallback(() => {
    setIsPromptVisible(true);
    setRemainingTime(promptTimeout / 1000);

    countdownInterval.current = window.setInterval(() => {
      setRemainingTime(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    promptTimer.current = window.setTimeout(handleIdle, promptTimeout);
  }, [promptTimeout, handleIdle]);
  
  const reset = useCallback(() => {
    clearTimers();
    setIsPromptVisible(false);
    idleTimer.current = window.setTimeout(showPrompt, idleTimeout);
  }, [clearTimers, showPrompt, idleTimeout]);


  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const eventHandler = () => reset();

    events.forEach(event => window.addEventListener(event, eventHandler));

    // Initial start
    reset();

    return () => {
      events.forEach(event => window.removeEventListener(event, eventHandler));
      clearTimers();
    };
  }, [reset, clearTimers]);

  return { isPromptVisible, remainingTime, stayActive: reset };
};
