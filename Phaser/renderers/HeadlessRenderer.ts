/// <reference path="../Game.ts" />
/// <reference path="../cameras/Camera.ts" />
/// <reference path="IRenderer.ts" />

module Phaser {

    export class HeadlessRenderer implements Phaser.IRenderer {

        constructor(game: Phaser.Game) {
            this._game = game;
        }

        private _game: Phaser.Game;

        public render() {}

        public inCamera(camera: Camera, sprite: Sprite): bool { return true; }

        public renderGameObject(object) {}

        public renderSprite(camera: Camera, sprite: Sprite): bool { return true; }

        public renderScrollZone(camera: Camera, scrollZone: ScrollZone): bool { return true; }

        public renderCircle(camera: Camera, circle: Circle, context, outline?: bool = true, fill?: bool = true, lineColor?: string = 'rgb(0,255,0)', fillColor?: string = 'rgba(0,100,0.0.3)', lineWidth?: number = 1): bool {
            return true;
        }

        public preRenderCamera(camera: Camera) { }

        public postRenderCamera(camera: Camera) { }

        public preRenderGroup(camera: Camera, group: Group) { }

        public postRenderGroup(camera: Camera, group: Group) { }

    }

}