/// <reference path="../../Game.ts" />
/// <reference path="Mouse.ts" />
/// <reference path="Keyboard.ts" />

class Input {

    constructor(game: Game) {

        this._game = game;

        this.mouse = new Mouse(this._game);
        this.keyboard = new Keyboard(this._game);

    }

    private _game: Game;

    public mouse: Mouse;
    public keyboard: Keyboard;

    public x: number;
    public y: number;

    public update() {

        this.mouse.update();

    }

    public reset() {

        this.mouse.reset();
        this.keyboard.reset();

    }

    public getWorldX(camera: Camera): number {

        return this.x;

    }

    public getWorldY(camera: Camera): number {

        return this.y;

    }

}
