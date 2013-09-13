/// <reference path="../Game.ts" />
/// <reference path="../geom/Vector2.ts" />
/// <reference path="Particle.ts" />
/// <reference path="PinConstraint.ts" />

/**
* Phaser - Verlet - Composite
*
* 
*/

module Phaser.Verlet {

    export class Composite {

        /**
        * Creates a new Composite object.
        * @class Composite
        * @constructor
        * @param {Number} x The x coordinate of vector2
        * @param {Number} y The y coordinate of vector2
        * @return {Composite} This object
        **/
        constructor(game: Game) {

            this._game = game;

            this.sprites = [];
            this.particles = [];
            this.constraints = [];

            this.frameBounds = new Phaser.Quad();

        }

        private _game: Game;

        /**
         * Texture of the particles to be rendered.
         */
        private _texture = null;

        /**
         * Rendering bounds for the texture
         * @type {Quad}
         */
        private frameBounds: Quad;

        //  local rendering related temp vars to help avoid gc spikes
        private _sx: number = 0;
        private _sy: number = 0;
        private _sw: number = 0;
        private _sh: number = 0;
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;
        private _hw: number = 0;
        private _hh: number = 0;

        public sprites: Phaser.Sprite[];
        public particles: Phaser.Verlet.Particle[];
        public constraints;

        public drawParticles = null;
        public drawConstraints = null;

        //  Create Constraints

        public createDistanceConstraint(a: Phaser.Verlet.Particle, b: Phaser.Verlet.Particle, stiffness: number, distance?: number = null): Phaser.Verlet.DistanceConstraint {

            this.constraints.push(new Phaser.Verlet.DistanceConstraint(a, b, stiffness, distance));
            return this.constraints[this.constraints.length - 1];

        }

        public createAngleConstraint(a: Phaser.Verlet.Particle, b: Phaser.Verlet.Particle, c: Phaser.Verlet.Particle, stiffness: number): Phaser.Verlet.AngleConstraint {

            this.constraints.push(new Phaser.Verlet.AngleConstraint(a, b, c, stiffness));
            return this.constraints[this.constraints.length - 1];

        }

        public createPinConstraint(a: Phaser.Verlet.Particle, pos: Vector2): Phaser.Verlet.PinConstraint {

            this.constraints.push(new Phaser.Verlet.PinConstraint(a, pos));
            return this.constraints[this.constraints.length - 1];

        }

        /**
         * Load a graphic for this Composite. The graphic cannot be a SpriteSheet yet.
         * @param key {string} Key of the graphic you want to load for this sprite.
         * @return {Composite} This object
         */
        public loadGraphic(key: string): Composite {

            if (this._game.cache.getImage(key) !== null)
            {
                if (this._game.cache.isSpriteSheet(key) == false)
                {
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

        }

        public hideConstraints: bool = true;
        public constraintLineColor: string = 'rgba(200,200,200,1)';

        private renderConstraints(context) {

            if (this.hideConstraints == true || this.constraints.length == 0)
            {
                return;
            }

            var i;

	        context.beginPath();

            for (i in this.constraints)
            {
                if (this.constraints[i].b)
                {
    	            context.moveTo(this.constraints[i].a.pos.x, this.constraints[i].a.pos.y);
    	            context.lineTo(this.constraints[i].b.pos.x, this.constraints[i].b.pos.y);
                }
            }

            context.strokeStyle = this.constraintLineColor;
	        context.stroke();
	        context.closePath();

        }

        private render(context) {

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

            for (i in this.particles)
            {
                //this._dx = cameraOffsetX + (this.frameBounds.topLeft.x - camera.worldView.x);
                //this._dy = cameraOffsetY + (this.frameBounds.topLeft.y - camera.worldView.y);
                this._dx = this.particles[i].pos.x - this._hw;
                this._dy = this.particles[i].pos.y - this._hh;
                this._dx = Math.round(this._dx);
                this._dy = Math.round(this._dy);

                context.drawImage(
                    this._texture,	    //	Source Image
                    this._sx, 			//	Source X (location within the source image)
                    this._sy, 			//	Source Y
                    this._sw, 			//	Source Width
                    this._sh, 			//	Source Height
                    this._dx, 			//	Destination X (where on the canvas it'll be drawn)
                    this._dy, 			//	Destination Y
                    this._dw, 			//	Destination Width (always same as Source Width unless scaled)
                    this._dh			//	Destination Height (always same as Source Height unless scaled)
                );
                
            }

        }

        public pin(index, pos?=null) {

            if (pos == null)
            {
                pos = this.particles[index].pos;
            }

            var pc = new Phaser.Verlet.PinConstraint(this.particles[index], pos);
            this.constraints.push(pc);
            return pc;

        }

    }

}
