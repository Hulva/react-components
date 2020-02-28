import React from 'react';

export const ToastContext = React.createContext<ToastContent>({ id: '', content: null });

export interface ToastContent {
    id: string,
    content: React.ReactNode
}