import React, { useRef, useState, useEffect } from 'react';
import { CheckIcon, FlameIcon, AlertIcon, InfoIcon, CloseIcon } from './icons';
import * as colors from './colors';
import { Placement, HoverFn } from './types';

import './toast-notification.css';
import { TransitionStatus } from 'react-transition-group/Transition';

// common
export const borderRadius = 4;
export const gutter = 8;
export const toastWidth = 360;

const appearances = {
    success: {
        icon: CheckIcon,
        text: colors.G500,
        fg: colors.G300,
        bg: colors.G50,
    },
    error: {
        icon: FlameIcon,
        text: colors.R500,
        fg: colors.R300,
        bg: colors.R50,
    },
    warning: {
        icon: AlertIcon,
        text: colors.Y500,
        fg: colors.Y300,
        bg: colors.Y50,
    },
    info: {
        icon: InfoIcon,
        text: colors.N400,
        fg: colors.B200,
        bg: 'white',
    },
};

export type AppearanceTypes = 'success' | 'error' | 'warning' | 'info';

const DisMissButton = (props: any) => (
    <div
        className="react-toast-notifications__toast__dismiss-button"
        role="button"
        css={{
            cursor: 'pointer',
            flexShrink: 0,
            opacity: 0.5,
            padding: `${gutter}px ${gutter * 1.5}px`,
            transition: 'opacity 150ms',
            ':hover': { opacity: 1 },
        }}
        {...props}
    />
);

const Content = (props: any) => (
    <div
        className="react-toast-notifications__toast__content"
        css={{
            flexGrow: 1,
            fontSize: 14,
            lineHeight: 1.4,
            minHeight: 40,
            padding: `${gutter}px ${gutter * 1.5}px`,
        }}
        {...props}
    />
);

export interface CountdownProps {
    autoDismissTimeout: number, opacity: number, isRunning: boolean, [key: string]: any
}

const Countdown = (props: CountdownProps) => {
    const countdownStyles = {
        animation: `shrinkKeyframes ${props.autoDismissTimeout}ms linear`,
        animationPlayState: props.isRunning ? 'running' : 'paused',
        backgroundColor: 'rgba(0,0,0,0.1)',
        bottom: 0,
        height: 0,
        left: 0,
        opacity: props.opacity,
        position: 'absolute',
        width: '100%',
    } as React.CSSProperties;
    return (
        <div
            className="react-toast-notifications__toast__countdown"
            style={countdownStyles}
            {...props}
        />
    );
}

export interface IconProps {
    appearance: AppearanceTypes,
    autoDismiss: boolean,
    autoDismissTimeout: number,
    isRunning: boolean
}

const Icon = (props: IconProps) => {
    const meta = appearances[props.appearance];
    const iconStyle = {
        backgroundColor: meta.fg,
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        color: meta.bg,
        flexShrink: 0,
        paddingBottom: gutter,
        paddingTop: gutter,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        width: 30,
    } as React.CSSProperties;
    return (
        <div
            className="react-toast-notifications__toast__icon-wrapper"
            style={iconStyle}
        >
            <Countdown
                opacity={props.autoDismiss ? 1 : 0}
                autoDismissTimeout={props.autoDismissTimeout}
                isRunning={props.isRunning}
            />
            <meta.icon
                className="react-toast-notifications__toast__icon"
                css={{ position: 'relative', zIndex: 1 }}
            />
        </div>
    );
};

// Transitions
// ------------------------------

function getTranslate(placement: Placement) {
    const pos = placement.split('-');
    const relevantPlacement = pos[1] === 'center' ? pos[0] : pos[1];
    const translateMap = new Map<string, string>();
    translateMap.set('right', 'translate3d(120%, 0, 0)');
    translateMap.set('left', 'translate3d(-120%, 0, 0)');
    translateMap.set('bottom', 'translate3d(0, 120%, 0)');
    translateMap.set('top', 'translate3d(0, -120%, 0)');

    return translateMap.get(relevantPlacement);
}
export const toastStates = (placement: Placement) => ({
    entering: { transform: getTranslate(placement) },
    entered: { transform: 'translate3d(0,0,0)' },
    exiting: { transform: 'scale(0.66)', opacity: 0 },
    exited: { transform: 'scale(0.66)', opacity: 0 },
    unmounted: {}
});

export interface ToastElementProps {
    appearance: AppearanceTypes,
    placement: Placement,
    transitionDuration: number,
    transitionState: TransitionStatus,
    [key: string]: any
}

const ToastElement = (props: ToastElementProps) => {
    const { appearance, placement, transitionState, transitionDuration, ...otherProps } = props;
    const [height, setHeight] = useState('auto');
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            if (transitionState === 'entered') {
                const el = elementRef.current;
                setHeight((el ? el.offsetHeight : 0) + gutter + '');
            }
            if (transitionState === 'exiting') {
                setHeight('0');
            }
        },
        [transitionState]
    );
    const toastElementStyle = {
        height,
        transition: `height ${transitionDuration - 100}ms 100ms`,
    }  as React.CSSProperties;
    const toastElementAppearanceStyle = {
        backgroundColor: appearances[appearance].bg,
        borderRadius,
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
        color: appearances[appearance].text,
        display: 'flex',
        marginBottom: gutter,
        transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
        width: toastWidth,
        ...toastStates(placement)[transitionState],
    }  as React.CSSProperties;
    return (
        <div
            ref={elementRef}
            style={toastElementStyle}
        >
            <div
                className={`react-toast-notifications__toast react-toast-notifications__toast--${appearance}`}
                style={toastElementAppearanceStyle}
                {...otherProps}
            />
        </div>
    );
};
// ==============================
// DefaultToast
// ==============================

export interface ToastProps {
    appearance: AppearanceTypes,
    autoDismiss: boolean, // may be inherited from ToastProvider
    autoDismissTimeout: number, // inherited from ToastProvider
    onDismiss: () => {},
    placement: Placement,
    transitionState: TransitionStatus, // inherited from ToastProvider
    [key: string]: any
};

export const DefaultToast = (props: ToastProps) => {
    const {
        appearance,
        autoDismiss,
        autoDismissTimeout,
        children,
        isRunning,
        onDismiss,
        placement,
        transitionDuration,
        transitionState,
        onMouseEnter,
        onMouseLeave,
        ...otherProps
    } = props;
    const dismissButtonStyle = {
        border: 0,
        clip: 'rect(1px, 1px, 1px, 1px)',
        height: 1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: 1,
    } as React.CSSProperties;
    return (
        <ToastElement
            appearance={appearance}
            placement={placement}
            transitionState={transitionState}
            transitionDuration={transitionDuration}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...otherProps}
        >
            <Icon
                appearance={appearance}
                autoDismiss={autoDismiss}
                autoDismissTimeout={autoDismissTimeout}
                isRunning={isRunning}
            />
            <Content>{children}</Content>
            {onDismiss ? (
                <DisMissButton onClick={onDismiss}>
                    <CloseIcon className="react-toast-notifications__toast__dismiss-icon" />
                    <span
                        className="react-toast-notifications__toast__dismiss-text"
                        style={dismissButtonStyle}
                    >Close</span>
                </DisMissButton>
            ) : null}
        </ToastElement>
    );
}
