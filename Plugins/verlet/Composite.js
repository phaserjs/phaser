var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="../geom/Vector2.ts" />
    /// <reference path="Particle.ts" />
    /// <reference path="PinConstraint.ts" />
    /**
    * Phaser - Verlet - Composite
    *
    *
    */
    (function (Verlet) {
        var Composite = (function () {
            /**
            * Creates a new Composite object.
            * @class Composite
            * @constructor
            * @param {Number} x The x coordinate of vector2
            * @param {Number} y The y coordinate of vector2
            * @return {Composite} This object
            **/
            function Composite(game) {
                /**
                * Texture of the particles to be rendered.
                */
                this._texture = null;
                //  local rendering related temp vars to help avoid gc spikes
                this._sx = 0;
                this._sy = 0;
                this._sw = 0;
                this._sh = 0;
                this._dx = 0;
                this._dy = 0;
                this._dw = 0;
                this._dh = 0;
                this._hw = 0;
                this._hh = 0;
                this.drawParticles = null;
                this.drawConstraints = null;
                this.hideConstraints = true;
                this.constraintLineColor = 'rgba(200,200,200,1)';
                this._game = game;
                this.sprites = [];
                this.particles = [];
                this.constraints = [];
                this.frameBounds = new Phaser.Quad();
            }
            Composite.prototype.createDistanceConstraint = //  Create Constraints
            function (a, b, stiffness, distance) {
                if (typeof distance === "undefined") { distance = null; }
                this.constraints.push(new Phaser.Verlet.DistanceConstraint(a, b, stiffness, distance));
                return this.constraints[this.constraints.length - 1];
            };
            Composite.prototype.createAngleConstraint = function (a, b, c, stiffness) {
                this.constraints.push(new Phaser.Verlet.AngleConstraint(a, b, c, stiffness));
                return this.constraints[this.constraints.length - 1];
            };
            Composite.prototype.createPinConstraint = function (a, pos) {
                this.constraints.push(new Phaser.Verlet.PinConstraint(a, pos));
                return this.constraints[this.constraints.length - 1];
            };
            Composite.prototype.loadGraphic = /**
            * Load a graphic for this Composite. The graphic cannot be a SpriteSheet yet.
            * @param key {string} Key of the graphic you want to load for this sprite.
            * @return {Composite} This object
            */
            function (key) {
                if(this._game.cache.getImage(key) !== null) {
                    if(this._game.cache.isSpriteSheet(key) == false) {
                        this._texture = this._game.cache.getImage(key);
                        this.frameBounds.width = this._texture.width;
                        this.frameBounds.height = this._texture.height;
                        this._hw = Math.floor(this.frameBounds.width / 2);
                        this._hh = Math.floor(this.frameBounds.width / 2);
                        this.drawParticles = this.render;
                        this.drawConstraints = this.renderConstraints;
                    }
                }
                return this;
            };
            Composite.prototype.renderConstraints = function (context) {
                if(this.hideConstraints == true || this.constraints.length == 0) {
                    return;
                }
                var i;
                context.beginPath();
                for(i in this.constraints) {
                    if(this.constraints[i].b) {
                        context.moveTo(this.constraints[i].a.pos.x, this.constraints[i].a.pos.y);
                        context.lineTo(this.constraints[i].b.pos.x, this.constraints[i].b.pos.y);
                    }
                }
                context.strokeStyle = this.constraintLineColor;
                context.stroke();
                context.closePath();
            };
            Composite.prototype.render = function (context) {
                this._sx = 0;
                this._sy = 0;
                this._sw = this.frameBounds.width;
                this._sh = this.frameBounds.height;
                this._dw = this.frameBounds.width;
                this._dh = this.frameBounds.height;
                this._sx = Math.round(this._sx);
                this._sy = Math.round(this._sy);
                this._sw = Math.round(this._sw);
                this._sh = Math.round(this._sh);
                this._dw = Math.round(this._dw);
                this._dh = Math.round(this._dh);
                var i;
                for(i in this.particles) {
                    //this._dx = cameraOffsetX + (this.frameBounds.topLeft.x - camera.worldView.x);
                    //this._dy = cameraOffsetY + (this.frameBounds.topLeft.y - camera.worldView.y);
                    this._dx = this.particles[i].pos.x - this._hw;
                    this._dy = this.particles[i].pos.y - this._hh;
                    this._dx = Math.round(this._dx);
                    this._dy = Math.round(this._dy);
                    context.drawImage(this._texture, //	Source Image
                    this._sx, //	Source X (location within the source image)
                    this._sy, //	Source Y
                    this._sw, //	Source Width
                    this._sh, //	Source Height
                    this._dx, //	Destination X (where on the canvas it'll be drawn)
                    this._dy, //	Destination Y
                    this._dw, //	Destination Width (always same as Source Width unless scaled)
                    this._dh);
                    //	Destination Height (always same as Source Height unless scaled)
                                    }
            };
            Composite.prototype.pin = function (index, pos) {
                if (typeof pos === "undefined") { pos = null; }
                if(pos == null) {
                    pos = this.particles[index].pos;
                }
                var pc = new Phaser.Verlet.PinConstraint(this.particles[index], pos);
                this.constraints.push(pc);
                return pc;
            };
            return Composite;
        })();
        Verlet.Composite = Composite;        
    })(Phaser.Verlet || (Phaser.Verlet = {}));
    var Verlet = Phaser.Verlet;
})(Phaser || (Phaser = {}));
