var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="Body.ts" />
    /// <reference path="joints/Joint.ts" />
    /**
    * Phaser - Physics Manager
    *
    * The Physics Manager is responsible for looking after, creating and colliding
    * all of the physics bodies and joints in the world.
    */
    (function (Physics) {
        var Manager = (function () {
            function Manager(game) {
                this.game = game;
            }
            Manager.clear = function clear() {
                //Manager.debug.textContent = "";
                Manager.log = [];
            };
            Manager.write = function write(s) {
                //Manager.debug.textContent += s + "\n";
                            };
            Manager.writeAll = function writeAll() {
                for(var i = 0; i < Manager.log.length; i++) {
                    //Manager.debug.textContent += Manager.log[i];
                                    }
            };
            Manager.log = [];
            Manager.dump = function dump(phase, body) {
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
                            };
            Manager.prototype.update = function () {
            };
            return Manager;
        })();
        Physics.Manager = Manager;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
