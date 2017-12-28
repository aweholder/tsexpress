import * as express from "express";

import { Controller } from "../web/controller";
import { R } from "../web/decorator";
import { IHomeProvider } from "../provider/homeProvider";

export class HomeController extends Controller {
    static $inject: string[] = ["HomeProvider"];
    constructor(
        private homeProvider: IHomeProvider
    ) {
        super();
    }

    @R.all("/")
    @R.get("/index/")
    async index(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const str = await this.homeProvider.getResource();
        res.nameView({
            title: str
        })
    }
}