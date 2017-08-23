import * as express from "express";

import { Controller } from "../app/web/controller";
import { R } from "../app/web/decorator";

export class HomeController extends Controller {

    constructor() {
        super();
    }

    @R.all("/")
    @R.get("/index/")
    async index(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        res.nameView({
            title: "quynv"
        })
    }
}