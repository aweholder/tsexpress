import * as path from "path"
import * as intravenous from "intravenous";
import { DI } from "../web/di"

export function Dependency(container: intravenous.IContainer) {
    DI.load(container, [
        path.join(__dirname, "/../provider/")
    ], "singleton");
}