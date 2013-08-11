var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Game.ts" />
/// <reference path="Sprite.ts" />
/**
* Phaser - Particle
*
* This is a simple particle class that extends a Sprite to have a slightly more
* specialised behaviour. It is used exclusively by the Emitter class and can be extended as required.
*/
var Phaser;
(function (Phaser) {
    var Particle = (function (_super) {
        __extends(Particle, _super);
        /**
        * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
        * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
        */
        function Particle(game) {
            _super.call(this, game);
            this.lifespan = 0;
            this.friction = 500;
        }
        Particle.prototype.update = /**
        * The particle's main update logic.  Basically it checks to see if it should
        * be dead yet, and then has some special bounce behavior if there is some gravity on it.
        */
        function () {
            //lifespan behavior
            if(this.lifespan <= 0) {
                return;
            }
            this.lifespan -= this._game.time.elapsed;
            if(this.lifespan <= 0) {
                this.kill();
            }
            //simpler bounce/spin behavior for now
            if(this.touching) {
                if(this.angularVelocity != 0) {
                    this.angularVelocity = -this.angularVelocity;
                }
            }
            if(this.acceleration.y > 0)//special behavior for particles with gravity
             {
                if(this.touching & Phaser.Collision.FLOOR) {
                    this.drag.x = this.friction;
                    if(!(this.wasTouching & Phaser.Collision.FLOOR)) {
                        if(this.velocity.y < -this.elasticity * 10) {
                            if(this.angularVelocity != 0) {
                                this.angularVelocity *= -this.elasticity;
                            }
                        } else {
                            this.velocity.y = 0;
                            this.angularVelocity = 0;
                        }
                    }
                } else {
                    this.drag.x = 0;
                }
            }
        };
        Particle.prototype.onEmit = /**
        * Triggered whenever this object is launched by a <code>Emitter</code>.
        * You can override this to add custom behavior like a sound or AI or something.
        */
        function () {
        };
        return Particle;
    })(Phaser.Sprite);
    Phaser.Particle = Particle;    
})(Phaser || (Phaser = {}));
