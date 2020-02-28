import React, { ComponentType } from 'react';
import { createPortal } from 'react-dom';
import { Transition, TransitionGroup } from 'react-transition-group';
import { ToastProps, DefaultToast, toastStates } from './ToastElement';
import { ToastContainerProps, ToastContainer } from './ToastContainer';
import { Placement, ToastsType, Options, ToastType } from './types';
import { ToastContext } from './ToastNotifications';
import { generateUEID } from './Utils';
import ToastController, { ToastControllerProps } from './ToastController';

const { Consumer, Provider } = ToastContext;
const canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

interface ToastTransitionProps {
    id: string;
    transitionDuration: number;
    toastControllerProps: ToastControllerProps;
    component: React.ReactType<ToastProps>,
    onDismiss: (id: string) => {}
}
const ToastTransition = (props: ToastTransitionProps) => {
    const { id, transitionDuration, toastControllerProps, component, onDismiss, ...unknownConsumerProps } = props;
    return (
        <Transition
            appear
            key={id}
            mountOnEnter
            timeout={transitionDuration}
            unmountOnExit
        >
            {state => (
                <ToastController
                    appearance={toastControllerProps.appearance}
                    autoDismiss={toastControllerProps.autoDismiss}
                    autoDismissTimeout={toastControllerProps.autoDismissTimeout}
                    component={component}
                    key={id}
                    onDismiss={() => onDismiss(id)}
                    placement={toastControllerProps.placement}
                    transitionDuration={transitionDuration}
                    transitionState={state}
                    {...unknownConsumerProps}
                />
            )}
        </Transition>
    );
}


export interface ToastProviderProps {
    // A convenience prop; the time until a toast will be dismissed automatically, in milliseconds.
    // Note that specifying this will override any defaults set on individual children Toasts.
    autoDismissTimeout: number,
    // Unrelated app content
    children: React.ReactElement,
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
export const defaultComponents = { Toast: DefaultToast, ToastContainer };
export class ToastProvider extends React.Component<ToastProviderProps, ToastProviderStates> {
    static defaultProps = {
        autoDismiss: false,
        autoDismissTimeout: 5000,
        components: defaultComponents,
        placement: 'top-right',
        transitionDuration: 220,
    };
    state: { toasts: ToastsType; };
    constructor(props: ToastProviderProps) {
        super(props);
        this.state = {
            toasts: [],
        };
    }
    has = (id: string) => {
        if (!this.state.toasts.length) {
            return false;
        }

        return Boolean(this.state.toasts.filter(t => t.id === id).length);
    };
    onDismiss = (id: string, cb: (id: string) => {}) => () => {
        cb(id);
        this.remove(id);
    };

    // Public API
    // ------------------------------

    add = (content: React.ReactElement, cb: (id: string) => {}, options?: Options) => {
        const id = (options && options.id) || generateUEID();
        const callback = () => cb(id);

        // bail if a toast exists with this ID
        if (this.has(id)) {
            return;
        }

        // update the toast stack
        // this.setState((state) => {
        //   const newToast = { content, id, ...options };
        //   const toasts = [...state.toasts, newToast];

        //   return { toasts };
        // }, callback);

        // consumer may want to do something with the generated ID (and not use the callback)
        return id;
    };
    remove = (id: string, cb: (id: string) => {}) => {
        const callback = () => cb(id);

        // bail if NO toasts exists with this ID
        if (!this.has(id)) {
            return;
        }

        this.setState(state => {
            const toasts = state.toasts.filter(t => t.id !== id);
            return { toasts };
        }, callback);
    };
    removeAll = () => {
        if (!this.state.toasts.length) {
            return;
        }

        // this.state.toasts.forEach(t => this.remove(t.id))
    };
    update = (id: string, cb: (id: string) => {}, options?: Options) => {
        const callback = () => cb(id);

        // bail if NO toasts exists with this ID
        if (!this.has(id)) {
            return;
        }

        // update the toast stack
        this.setState(state => {
            const old = state.toasts;
            const i = old.findIndex(t => t.id === id);
            const updatedToast = { ...old[i], ...options };
            const toasts = [...old.slice(0, i), updatedToast, ...old.slice(i + 1)];

            return { toasts };
        }, callback);
    };
    render() {
        const {
            //   autoDismiss: inheritedAutoDismiss,
            autoDismissTimeout,
            children,
            components,
            placement,
            transitionDuration,
        } = this.props;
        const { Toast, ToastContainer } = { ...defaultComponents, ...components };
        const { add, remove, removeAll, update } = this;
        const toasts = Object.freeze(this.state.toasts);

        const hasToasts = Boolean(toasts.length);
        const portalTarget = canUseDOM ? document.body : null; // appease flow
        return (
            <Provider value={{ add, remove, removeAll, update, toasts }}>
                {children}

                {portalTarget ? (
                    createPortal(
                        <ToastContainer placement={placement} hasToasts={hasToasts}>
                            <TransitionGroup component={null}>
                                {toasts.map(
                                    ({
                                        appearance,
                                        autoDismiss,
                                        content,
                                        id,
                                        onDismiss,
                                        ...unknownConsumerProps
                                    }) => (
                                            
                                        )
                                )}
                            </TransitionGroup>
                        </ToastContainer>,
                        portalTarget
                    )
                ) : (
                        <ToastContainer placement={placement} hasToasts={hasToasts} /> // keep ReactDOM.hydrate happy
                    )}
            </Provider>
        );
    }
} 