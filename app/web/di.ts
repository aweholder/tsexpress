import * as wrench from "wrench"
import * as intravenous from "intravenous";
import * as path from "path";

interface DIOptions {
    isRegister?: boolean;
    lifecycle?: "perRequest" | "unique" | "singleton";
    name?: string
}

interface IMetaFunction extends Function {
    __meta__: DIOptions;
}

export class DI {
    public static load(container: intravenous.IContainer, dirs: string[], lifecycle: "perRequest" | "unique" | "singleton"): void {
        const registeredModule = {};
        dirs.forEach(dir => {
            const modules = wrench.readdirSyncRecursive(dir);
            modules.forEach(f => {
                if (path.extname(f) != ".ts") {
                    return;
                }

                const moduleFile = path.basename(f, ".ts");
                const modulePath = path.join(dir, path.dirname(f), `${moduleFile}.js`);

                const module: Object = require(modulePath);
                for (const m in module) {
                    if (!module.hasOwnProperty(m)) {
                        continue;
                    }

                    const extendedModule: IMetaFunction = module[m];
                    if (!(extendedModule.__meta__ && extendedModule.__meta__.isRegister)) {
                        continue;
                    }

                    const registerLifecycle = extendedModule.__meta__.lifecycle || lifecycle;
                    const registerName = extendedModule.__meta__.name || m;

                    if (registeredModule[registerName]) {
                        continue;
                    }
                    container.register(registerName, module[m], registerLifecycle);
                    registeredModule[registerName] = m;
                }
            });
        });
    }

    public static register(options?: DIOptions): ClassDecorator {
        return (target: Function) => {
            (<IMetaFunction> target).__meta__ =  (<IMetaFunction> target).__meta__ || {};
            (<IMetaFunction> target).__meta__.isRegister = true;
            if (options && options.name) {
                (<IMetaFunction> target).__meta__.name = options.name;
            }

            if (options && options.lifecycle) {
                (<IMetaFunction> target).__meta__.lifecycle = options.lifecycle;
            }
        }
    }
}