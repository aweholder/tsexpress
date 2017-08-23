/// <reference path='../../typings/lib.d.ts' />

import { RouteMethods } from "./router";

export interface IMethodDecorated extends Function {
    methods: IRouteMeta[];
    middleware: MiddlewareMeta;
}

export interface IRouteMeta {
    path: string | string[];
    method: RouteMethods;
}

export class MiddlewareMeta {
    before: MiddlewareResolver[];
    after: MiddlewareResolver[];

    constructor() {
        this.before = [];
        this.after = [];
    }
}

export class R {
    static get(path: string | string[]) {
        return (target, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
            descriptor.value = <IMethodDecorated>descriptor.value;
            if (!descriptor.value.methods) {
                descriptor.value.methods = [];
            }
            descriptor.value.methods.push({
                method: RouteMethods.GET,
                path: path
            });
        }
    }

    static post(path: string | string[]) {
        return (target, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
            descriptor.value = <IMethodDecorated>descriptor.value;
            if (!descriptor.value.methods) {
                descriptor.value.methods = [];
            }
            descriptor.value.methods.push({
                method: RouteMethods.POST,
                path: path
            });
        }
    }

    static all(path: string | string[]) {
        return (target, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
            descriptor.value = <IMethodDecorated>descriptor.value;
            if (!descriptor.value.methods) {
                descriptor.value.methods = [];
            }
            descriptor.value.methods.push({
                method: RouteMethods.ALL,
                path: path
            });
        }
    }
}