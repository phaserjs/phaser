/// <reference path="../Game.ts" />

/**
* Phaser - Polygon
*
* 
*/

module Phaser {

    export class Polygon {

        /**
        *
        **/
        constructor(game: Game, points: Point[]) {

            this.game = game;
            this.context = game.stage.context;

            this.points = [];

            for (var i = 0; i < points.length; i++)
            {
                this.points.push(new Point().copyFrom(points[i]));
            }

        }

        public points: Point[];
        public game: Game;
        public context: CanvasRenderingContext2D;

        public render() {

            this.context.beginPath();
            this.context.strokeStyle = 'rgb(255,255,0)';
            this.context.moveTo(this.points[0].x, this.points[0].y);

            for (var i = 1; i < this.points.length; i++)
            {
                this.context.lineTo(this.points[i].x, this.points[i].y);
            }

            this.context.lineTo(this.points[0].x, this.points[0].y);

            this.context.stroke();
            this.context.closePath();

        }

    }

}