import * as express from "express";

export interface ViewPath {
    controllerName: string;
    methodName: string;
}

export function handler(req: express.Request, res: express.Response, next: express.NextFunction, path: ViewPath): void {
    
    const nameView = (obj?: Object): void => {
        const viewName: string = `${path.controllerName}/${path.methodName}.jinja2`;
        return view(viewName, obj);
    }

    const view = (viewName: string, obj?: Object): void => {
        let viewModel: Object | undefined = undefined;
        if (!!obj || typeof obj === "object") {
            viewModel = obj;
        } else {
            viewModel = {};
        }

        viewModel["req"] = req;
        viewModel["res"] = res;

        try {
            res.render(viewName, viewModel);
        } catch (error) {
            next(error);
        }
    }

    const notFound = (message?: string): void => {
        const error: any = new Error();
        error.statusCode = 404;
        next(error);
    };

    const isAjax = (): boolean => {
        return req.xhr || (!!req.headers["accept"] && req.headers["accept"].indexOf("json") !== -1);
    };

    res.view = view;
    res.nameView = nameView;
    res.notFound = notFound;
    
    req.isAjax = isAjax;
}