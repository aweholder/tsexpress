import * as wrench from "wrench";
import * as path from "path";
import * as intravenous from "intravenous";
import * as express from "express";

import { IMethodDecorated } from "./decorator";
import { ViewPath, handler } from "./http";

export enum RouteMethods {
    GET = "get",
    POST = "post",
    ALL = "all"
}

export interface ControllerModule {
    name: string, 
    path: string
}

export class ControllerResolver {
    router: express.Router;
    static register(container: intravenous.IContainer, app: express.Express, controllersDir: string): void {
        const controllers = wrench.readdirSyncRecursive(controllersDir);
        
        const controllerContainer: ControllerModule[] = [];
        controllers.forEach((fileName) => {
            if (path.extname(fileName) !== ".ts") {
                return;
            }
    
            /* tslint:disable */
            const jsFile = path.basename(fileName, ".ts");
            const jsPath = path.join(controllersDir, path.dirname(fileName), `${jsFile}.js`);
            const module: Object = require(jsPath);
            /* tslint:enable */
            const router = express.Router();
            for (const m in module) {
                if (!module.hasOwnProperty(m)) {
                    continue;
                }
                if (!m.endsWith("Controller")) {
                    continue;
                }
    
                const hasExist = controllerContainer.find(c => c.name === m);
                if (hasExist) {
                    console.log(`Duplicate controllers found (${m}) in ${hasExist.path} and ${jsPath}`);
                    continue;
                }
    
                controllerContainer.push({
                    name: m,
                    path: jsPath
                });
                container.register(m, module[m], "perRequest");
                const instance = container.get(m);
                for (const method of this.enumerateMethods(instance)) {
                    const methodDecorated = <IMethodDecorated> instance[method];
                    for (const f of methodDecorated.methods) {
                        if (!f.path) {
                            continue;
                        }
                        
                        const middlewares: (express.RequestHandler | express.ErrorRequestHandler)[] = [];
                        if (methodDecorated.middleware && methodDecorated.middleware.before) {
                            middlewares.push(...methodDecorated.middleware.before);
                        }
                    
                        const primaryAction = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    
                            const actionMiddleware = <express.RequestHandler>(instance[method]).bind(instance);
                            const controllerName = m.replace("Controller", "");
                            const path: ViewPath = {
                                controllerName: controllerName,
                                methodName: method
                            }
                            handler(req, res, next, path);
    
                            try {
                                const result = actionMiddleware(req, res, next);
                                if (result["then"]) {
                                    await result;
                                }
                            } catch (error) {
    
                            }
                        }
                        middlewares.push(primaryAction);
                        if (methodDecorated.middleware && methodDecorated.middleware.before) {
                            middlewares.push(...methodDecorated.middleware.after);
                        }
                        const args = [f.path, middlewares];
                        router[f.method].bind(router).apply(router, args);
                    }
                }
            }
            app.use(router);
        });
    }

    private static enumerateMethods(obj: Object): string[] {
        const result: string[] = [];
        for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))) {
            const method = obj[name];
            if (!(method instanceof Function) || name === "constructor") {
                continue;
            }
            result.push(name);
        }
        return result;
    }
}