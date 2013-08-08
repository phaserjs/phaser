/// <reference path="../../_definitions.ts" />

module Phaser.Renderer.Canvas {

    export class GeometryRenderer {

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        /**
         * The essential reference to the main game object
         */
        public game: Phaser.Game;

        //  Local rendering related temp vars to help avoid gc spikes through constant var creation
        private _ga: number = 1;
        private _sx: number = 0;
        private _sy: number = 0;
        private _sw: number = 0;
        private _sh: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;
        private _fx: number = 1;
        private _fy: number = 1;
        private _sin: number = 0;
        private _cos: number = 1;

        public renderCircle(camera: Phaser.Camera, circle: Phaser.Circle, context, outline: boolean = false, fill: boolean = true, lineColor: string = 'rgb(0,255,0)', fillColor: string = 'rgba(0,100,0.0.3)', lineWidth: number = 1): boolean {

            //  Reset our temp vars
            this._sx = 0;
            this._sy = 0;
            this._sw = circle.diameter;
            this._sh = circle.diameter;
            this._fx = 1;
            this._fy = 1;
            this._sin = 0;
            this._cos = 1;
            this._dx = camera.screenView.x + circle.x - camera.worldView.x;
            this._dy = camera.screenView.y + circle.y - camera.worldView.y;
            this._dw = circle.diameter;
            this._dh = circle.diameter;

            this._sx = Math.floor(this._sx);
            this._sy = Math.floor(this._sy);
            this._sw = Math.floor(this._sw);
            this._sh = Math.floor(this._sh);
            this._dx = Math.floor(this._dx);
            this._dy = Math.floor(this._dy);
            this._dw = Math.floor(this._dw);
            this._dh = Math.floor(this._dh);

            this.game.stage.saveCanvasValues();

            context.save();
            context.lineWidth = lineWidth;
            context.strokeStyle = lineColor;
            context.fillStyle = fillColor;

            context.beginPath();
            context.arc(this._dx, this._dy, circle.radius, 0, Math.PI * 2);
            context.closePath();

            if (outline)
            {
                //context.stroke();
            }

            if (fill)
            {
                context.fill();
            }

            context.restore();

            this.game.stage.restoreCanvasValues();

            return true;

        }

    }

}