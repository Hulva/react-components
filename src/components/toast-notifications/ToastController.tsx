import React, { useState, useEffect } from 'react';
import { ToastProps } from './ToastElement';

export interface ToastControllerProps extends ToastProps {
    component: React.ReactType<ToastProps>
}

const ToastController = (props: ToastControllerProps) => {
    const { component: Toast, ...otherProps } = props;

    const [isRunning, setIsRunning] = useState(props.autoDismiss);
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const [remaining, setRemaining] = useState(props.autoDismissTimeout);
    const [start] = useState<number>(Date.now());

    function handleMouseEnter() {
        if (!props.autoDismiss) return;
        if (isRunning) {
            if (timer) clearTimeout(timer);
            const newRemaining = Date.now() - start - remaining;
            setRemaining(newRemaining);
        }
        setIsRunning(false);
    }
    function handleMouseLeave() {
        if (!props.autoDismiss) return;
        setIsRunning(true);
    }

    useEffect(() => {
        if (props.autoDismiss)
        if (isRunning) {
            if (timer) clearTimeout(timer);
            const newTimer = setTimeout(props.onDismiss, remaining);
            setTimer(newTimer);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [isRunning, props.autoDismiss, props.onDismiss, timer, remaining]);
    return (
        <Toast onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...otherProps} />
    );
}

export default ToastController;
