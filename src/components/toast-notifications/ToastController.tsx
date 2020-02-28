import React, { ComponentType, useState, useEffect } from 'react';
import { ToastProps } from './ToastElement';
import { NOOP } from './Utils';

const defaultAutoDismissTimeout = 5000;

export interface ToastControllerProps extends ToastProps {
    component: ComponentType<ToastProps>
}
export interface ToastControllerStates {
    isRunning: boolean
}
interface TimerType {
    clear: typeof NOOP,
    pause: typeof NOOP,
    resume: typeof NOOP,
};

const ToastController: React.FC<ToastControllerProps> = props => {
    const { autoDismiss, autoDismissTimeout, onDismiss, component: Toast } = props;
    const actualAutoDismissTimeout = autoDismissTimeout | defaultAutoDismissTimeout;
    const realAutoDismiss = autoDismiss || false;

    const [isRunning, setIsRunning] = useState(realAutoDismiss);
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const [remaining, setRemaining] = useState(actualAutoDismissTimeout);
    const [start, setStart] = useState<number>();

    function onMouseEnter() {
        setIsRunning(false);
    }
    function onMouseLeave() {
        setIsRunning(true);
    }

    useEffect(() => {
        if (!realAutoDismiss) return;
        if (!start) setStart(Date.now());
        if (isRunning) {
            if (timer) clearTimeout(timer);
        } else {
            if (timer) {
                clearTimeout(timer);
                if (start) {
                    const newRemaining = Date.now() - start - remaining;
                    setRemaining(newRemaining);
                }
            }
        }
        const newTimer = setTimeout(onDismiss, remaining | actualAutoDismissTimeout);
        setTimer(newTimer);
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [isRunning]);

    const handleMouseEnter = realAutoDismiss ? onMouseEnter : NOOP;
    const handleMouseLeave = realAutoDismiss ? onMouseLeave : NOOP;
    return (
        <Toast
            autoDismiss={realAutoDismiss}
            autoDismissTimeout={actualAutoDismissTimeout}
            isRunning={isRunning}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        />
    );
}

export default ToastController;
