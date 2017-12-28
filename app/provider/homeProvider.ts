import { DI } from "../web/di"

export interface IHomeProvider {
    getResource(): Promise<string>;
}

@DI.register()
export class HomeProvider implements IHomeProvider {
    constructor() {

    }

    async getResource(): Promise<string> {
        return "Test";
    }

}