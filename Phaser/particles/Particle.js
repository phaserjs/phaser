/// <reference path="../_definitions.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Phaser - ArcadeParticle
*
* This is a simple particle class that extends a Sprite to have a slightly more
* specialised behaviour. It is used exclusively by the Emitter class and can be extended as required.
*/
var Phaser;
(function (Phaser) {
    var ArcadeParticle = (function (_super) {
        __extends(ArcadeParticle, _super);
        /**
        * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
        * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
        */
        function ArcadeParticle(game) {
            _super.call(this, game);

            this.body.type = Phaser.Types.BODY_DYNAMIC;
            this.lifespan = 0;
        }
        /**
        * The particle's main update logic.  Basically it checks to see if it should be dead yet.
        */
        ArcadeParticle.prototype.update = function () {
            if (this.lifespan <= 0) {
                return;
            }

            this.lifespan -= this.game.time.elapsed;

            if (this.lifespan <= 0) {
                this.kill();
            }
        };

        /**
        * Triggered whenever this object is launched by a <code>Emitter</code>.
        * You can override this to add custom behavior like a sound or AI or something.
        */
        ArcadeParticle.prototype.onEmit = function () {
        };
        return ArcadeParticle;
    })(Phaser.Sprite);
    Phaser.ArcadeParticle = ArcadeParticle;
})(Phaser || (Phaser = {}));
