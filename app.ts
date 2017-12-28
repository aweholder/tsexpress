/// <reference path='./typings/lib.d.ts' />
import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as intravenous from "intravenous";
import * as nunjucks from "nunjucks";

import { ControllerResolver } from "./app/web/router";
import { Dependency } from "./app/di/configuration";

export class Application {
    public app: express.Express;
    public server: http.Server;
    public env: string;

    constructor () {

    }

    async run(): Promise<void> {
        try {
            this.env = process.env['NODE_ENV'] || "development";
            this.app = express();

            const port = parseInt(process.env['PORT'] || "3000", 10);
            this.app.set("port", port);
            this.app.set("env", this.env);
            this.server = http.createServer(this.app);
            this.configureView();
            const container = intravenous.create();
            Dependency(container);
            this.resolveController(container);
            this.server.listen(port, () => {
                console.log(`Server is runing on ${port}!`);
            });
            this.server.on("error", this.onError);
        } catch (error) {
            console.error(error.stack);
        }
    }

    private configureView(): void {
        this.app.set("view engine", "jinja2");
        this.app.set("views", path.join(__dirname, "views"));
        nunjucks.configure('./views', {
            autoescape: true,
            express: this.app
        });
    }

    private resolveController(container: intravenous.IContainer): void {
        ControllerResolver.register(container, this.app, path.join(__dirname, "controllers"));
    }

    private onError(error: Error): void {
        console.error(error);
    }
}