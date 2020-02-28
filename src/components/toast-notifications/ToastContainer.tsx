import React from 'react';
import { Placement } from './types';
import { gutter } from './ToastElement';

const placements = {
    'top-left': { top: 0, left: 0 },
    'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
    'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: 0, right: 0 },
};

export type ToastContainerProps = {
    hasToasts: boolean,
    placement: Placement,
    children?: Node,
    [key: string]: any
};



export const ToastContainer = (props: ToastContainerProps) => {
    const {
        hasToasts,
        placement,
        ...otherProps
    } = props;
    const mystyles = {
        boxSizing: 'border-box',
        maxHeight: '100%',
        overflow: 'hidden',
        padding: gutter,
        pointerEvents: hasToasts ? null : 'none',
        position: 'fixed',
        zIndex: 1000,
        ...placements[placement],
    } as React.CSSProperties;
    return (
        <div
            className="react-toast-notifications__container"
            style={mystyles}
            {...otherProps}
        />
    );
}
