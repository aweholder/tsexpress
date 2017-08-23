

export class Controller {
    private className: string;

    constructor() {
        this.className = Object.getPrototypeOf(this).constructor.name;
    }
}