/// <reference path="Game.ts" />

/**
* Phaser - State
*
* This is a base State class which can be extended if you are creating your game using TypeScript.
*/

module Phaser {

    export class State {

        constructor(game: Game) {

            this.game = game;

            this.camera = game.camera;
            this.cache = game.cache;
            this.collision = game.collision;
            this.input = game.input;
            this.loader = game.loader;
            this.math = game.math;
            this.motion = game.motion;
            this.sound = game.sound;
            this.stage = game.stage;
            this.time = game.time;
            this.tweens = game.tweens;
            this.world = game.world;

        }

        public game: Game;

        public camera: Camera;
        public cache: Cache;
        public collision: Collision;
        public input: Input;
        public loader: Loader;
        public math: GameMath;
        public motion: Motion;
        public sound: SoundManager;
        public stage: Stage;
        public time: Time;
        public tweens: TweenManager;
        public world: World;


        //  Overload these in your own States
        public init() { }
        public create() { }
        public update() { }
        public render() { }
        public paused() { }

        //  Handy Proxy methods

        public createCamera(x: number, y: number, width: number, height: number): Camera {
            return this.game.world.createCamera(x, y, width, height);
        }

        public createGeomSprite(x: number, y: number): GeomSprite {
            return this.world.createGeomSprite(x, y);
        }

        public createSprite(x: number, y: number, key?: string = ''): Sprite {
            return this.game.world.createSprite(x, y, key);
        }

        public createDynamicTexture(key: string, width: number, height: number): DynamicTexture {
            return this.game.world.createDynamicTexture(key, width, height);
        }

        public createGroup(MaxSize?: number = 0): Group {
            return this.game.world.createGroup(MaxSize);
        }

        public createParticle(): Particle {
            return this.game.world.createParticle();
        }

        public createEmitter(x?: number = 0, y?: number = 0, size?: number = 0): Emitter {
            return this.game.world.createEmitter(x, y, size);
        }

        public createTilemap(key: string, mapData: string, format: number, tileWidth?: number, tileHeight?: number): Tilemap {
            return this.game.world.createTilemap(key, mapData, format, tileWidth, tileHeight);
        }

        public createTween(obj): Tween {
            return this.game.tweens.create(obj);
        }

        public collide(ObjectOrGroup1: Basic = null, ObjectOrGroup2: Basic = null, NotifyCallback = null): bool {
            return this.collision.overlap(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, Collision.separate);
        }

    }

}