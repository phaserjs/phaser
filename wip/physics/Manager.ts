/// <reference path="../Game.ts" />
/// <reference path="Body.ts" />
/// <reference path="joints/Joint.ts" />

/**
* Phaser - Physics Manager
*
* The Physics Manager is responsible for looking after, creating and colliding
* all of the physics bodies and joints in the world.
*/

module Phaser.Physics {

    export class Manager {

        constructor(game: Game) {
            this.game = game;
        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        public static debug: HTMLTextAreaElement;

        public static clear() {
            //Manager.debug.textContent = "";
            Manager.log = [];
        }

        public static write(s: string) {
            //Manager.debug.textContent += s + "\n";
        }

        public static writeAll() {

            for (var i = 0; i < Manager.log.length; i++)
            {
                //Manager.debug.textContent += Manager.log[i];
            }

        }

        public static log = [];

        public static dump(phase: string, body: Body) {

            /*
            var s = "\n\nPhase: " + phase + "\n";
            s += "Position: " + body.position.toString() + "\n";
            s += "Velocity: " + body.velocity.toString() + "\n";
            s += "Angle: " + body.angle + "\n";
            s += "Force: " + body.force.toString() + "\n";
            s += "Torque: " + body.torque + "\n";
            s += "Bounds: " + body.bounds.toString() + "\n";
            s += "Shape ***\n";
            s += "Vert 0: " + body.shapes[0].verts[0].toString() + "\n";
            s += "Vert 1: " + body.shapes[0].verts[1].toString() + "\n";
            s += "Vert 2: " + body.shapes[0].verts[2].toString() + "\n";
            s += "Vert 3: " + body.shapes[0].verts[3].toString() + "\n";
            s += "TVert 0: " + body.shapes[0].tverts[0].toString() + "\n";
            s += "TVert 1: " + body.shapes[0].tverts[1].toString() + "\n";
            s += "TVert 2: " + body.shapes[0].tverts[2].toString() + "\n";
            s += "TVert 3: " + body.shapes[0].tverts[3].toString() + "\n";
            s += "Plane 0: " + body.shapes[0].planes[0].normal.toString() + "\n";
            s += "Plane 1: " + body.shapes[0].planes[1].normal.toString() + "\n";
            s += "Plane 2: " + body.shapes[0].planes[2].normal.toString() + "\n";
            s += "Plane 3: " + body.shapes[0].planes[3].normal.toString() + "\n";
            s += "TPlane 0: " + body.shapes[0].tplanes[0].normal.toString() + "\n";
            s += "TPlane 1: " + body.shapes[0].tplanes[1].normal.toString() + "\n";
            s += "TPlane 2: " + body.shapes[0].tplanes[2].normal.toString() + "\n";
            s += "TPlane 3: " + body.shapes[0].tplanes[3].normal.toString() + "\n";

            Manager.log.push(s);
            */

        }

        public update() {

        }

    }

}