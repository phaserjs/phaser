/// <reference path="../../Game.ts" />
/// <reference path="Mouse.ts" />
/// <reference path="Keyboard.ts" />
/// <reference path="Touch.ts" />

class Input {

    constructor(game: Game) {

        this._game = game;

        this.mouse = new Mouse(this._game);
        this.keyboard = new Keyboard(this._game);
        this.touch = new Touch(this._game);

    }

    private _game: Game;

    public mouse: Mouse;
    public keyboard: Keyboard;
    public touch: Touch;

    public x: number;
    public y: number;

    public update() {

        this.mouse.update();
        this.touch.update();

    }

    public reset() {

        this.mouse.reset();
        this.keyboard.reset();
        this.touch.reset();

    }

    public getWorldX(camera: Camera): number {

        return this.x;

    }

    public getWorldY(camera: Camera): number {

        return this.y;

    }

}
