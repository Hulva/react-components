import React from 'react';
import { Placement } from './types';
import { gutter } from './ToastElement';
import { PointerEventsProperty } from 'csstype';

const placements = {
    'top-left': { top: 0, left: 0 },
    'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: 0, right: 0 },
    'bottom-left': { bottom: 0, left: 0 },
    'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: 0, right: 0 },
};

export type ToastContainerProps = {
    children?: Node,
    hasToasts: boolean,
    placement: Placement,
    [key: string]: any
};

export const ToastContainer: React.FC<ToastContainerProps> = props => {
    const {
        hasToasts,
        placement,
        ...otherProps
    } = props;
    return (
        <div
            className="react-toast-notifications__container"
            css={{
                boxSizing: 'border-box',
                maxHeight: '100%',
                overflow: 'hidden',
                padding: gutter,
                pointerEvents: hasToasts ? null as unknown as PointerEventsProperty  : 'none' as PointerEventsProperty ,
                position: 'fixed',
                zIndex: 1000,
                ...placements[placement],
            }}
            {...otherProps}
        />
    );
}
