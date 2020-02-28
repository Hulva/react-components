export type AppearanceTypes = 'error' | 'info' | 'success' | 'warning';
export type Callback = (id: string) => void;
export type Options = {
  id: string,
  appearance: AppearanceTypes,
  autoDismiss?: boolean,
  onDismiss?: Callback,
};

export type AddFn = (content: Node, options?: Options) => string;
export type UpdateFn = (id: string, options: Options) => void;
export type RemoveFn = (id: string) => void;

export type Placement =
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'top-left'
  | 'top-center'
  | 'top-right';

export type ToastType = Options & { appearance: AppearanceTypes, content: Node, id: string };
export type ToastsType = Array<ToastType>;
