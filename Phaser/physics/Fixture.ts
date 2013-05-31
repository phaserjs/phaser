/// <reference path="../core/Vec2.ts" />
/// <reference path="../core/Point.ts" />
/// <reference path="../math/Vec2Utils.ts" />
/// <reference path="../physics/AABB.ts" />
/// <reference path="../physics/Circle.ts" />
/// <reference path="../physics/IPhysicsBody.ts" />

/**
* Phaser - Physics - Fixture
*/

module Phaser.Physics {

    export class Fixture {

        constructor(parent: Sprite, type: number) {

            this.parent = parent;

            //  these are shape properties really
            this.bounce = Vec2Utils.clone(this.game.world.physics.bounce);
            this.friction = Vec2Utils.clone(this.game.world.physics.friction);

        }

        public game: Game;
        public parent: Sprite;

    }

}