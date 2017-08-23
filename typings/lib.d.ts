/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

declare module "intravenous" {
    export interface IRegisterFn {
        (name: string, object: Function | Object, lifecycle?: string): void;
    }

    export interface IGetFn {
        (name: string): any;
    }

    export interface IContainer {
        register: IRegisterFn;
        get: IGetFn;
        create(): IContainer;
        dispose(): void;
    }

    export interface IFactory<T> {
        get(): T;
        use(dependencyName: string, overrideValue: any): IFactory<T>;
    }

    export function create(): IContainer;
}

interface MiddlewareResolver {
    (): express.RequestHandler | express.ErrorRequestHandler;
}

declare module Express {
    export interface Response {
        view(obj?: Object): void;
        nameView(obj?: Object): void;
        notFound(message?: string): void;
    }

    export interface Request {
        isAjax(): boolean;
    }
}