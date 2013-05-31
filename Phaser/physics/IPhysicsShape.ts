/// <reference path="../Game.ts" />
/// <reference path="../core/Rectangle.ts" />
/// <reference path="PhysicsManager.ts" />

/**
* Phaser - Physics - IPhysicsShape
*/

module Phaser.Physics {

    export interface IPhysicsShape {
 
        game: Game;
        world: PhysicsManager;
        sprite: Sprite;
        physics: Phaser.Components.Physics;

        position: Vec2;
        oldPosition: Vec2;
        offset: Vec2;

        bounds: Rectangle;
        //oH: number;
        //oV: number;

        setSize(width: number, height: number);
        preUpdate();
        update();
        render(context:CanvasRenderingContext2D);

        hullX;
        hullY;
        hullWidth;
        hullHeight;
        deltaX;
        deltaY;
        deltaXAbs;
        deltaYAbs;

    }

}
