export default class alert {
    constructor({ message, background, color }) {
        this.message = message;
        this.background = background;
        this.color = color;
    }

    show() {
        console.log(`%c${this.message}`, `background: ${this.background}; color: ${this.color}`);
    }
}