import React from "react";
import { Options } from "./types";
import { DefaultToast } from "./ToastElement";

export interface IToastContext {
    id: string,
    content: Node,
    options?: Options
}

export const ToastContext = React.createContext<IToastContext>({ id: '', content: DefaultToast({})});