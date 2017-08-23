/// <reference path='../../typings/lib.d.ts' />

import { IMethodDecorated, MiddlewareMeta } from "./decorator";

export class M {
    static before(middleware: MiddlewareResolver): Function {
        return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
            descriptor.value = <IMethodDecorated> descriptor.value;
            if (!descriptor.value.middleware) {
                descriptor.value.middleware = new MiddlewareMeta();
            }
            descriptor.value.middleware.before.push(middleware);
        };
    }

    static after(middleware: MiddlewareResolver): Function {
        return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
            descriptor.value = <IMethodDecorated> descriptor.value;
            if (!descriptor.value.middleware) {
                descriptor.value.middleware = new MiddlewareMeta();
            }
            descriptor.value.middleware.after.push(middleware);
        };
    }
}