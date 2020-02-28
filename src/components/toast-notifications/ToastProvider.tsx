import React, { ComponentType } from 'react';
import { ToastProps } from './ToastElement';
import { ToastContainerProps } from './ToastContainer';
import { Placement, ToastsType } from './types';

export interface ToastProviderProps {
    // A convenience prop; the time until a toast will be dismissed automatically, in milliseconds.
    // Note that specifying this will override any defaults set on individual children Toasts.
    autoDismissTimeout: number,
    // Unrelated app content
    children: Node,
    // Component replacement object
    components: {
        Toast: ComponentType<ToastProps>,
        ToastContainer: ComponentType<ToastContainerProps>,
    },
    // Where, in relation to the viewport, to place the toasts
    placement: Placement,
    // A convenience prop; the duration of the toast transition, in milliseconds.
    // Note that specifying this will override any defaults set on individual children Toasts.
    transitionDuration: number,
}

export interface ToastProviderStates {
    toasts: ToastsType
}

export class ToastProvider extends React.Component<ToastProviderProps, ToastProviderStates> {



} 