/// <reference path="Game.ts" />

/**
* Phaser - State
*
* This is a base State class which can be extended if you are creating your game using TypeScript.
*/

module Phaser {

    export class State {

        /**
         * State constructor
         * Create a new <code>State</code>.
         */
        constructor(game: Game) {

            this.game = game;

            this.add = game.add;
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

        /**
         * Reference to Game.
         */
        public game: Game;

        /**
         * Currently used camera.
         * @type {Camera}
         */
        public camera: Camera;

        /**
         * Reference to the assets cache.
         * @type {Cache}
         */
        public cache: Cache;

        /**
         * Reference to the collision helper.
         * @type {Collision}
         */
        public collision: Collision;

        /**
         * Reference to the GameObject Factory.
         * @type {GameObjectFactory}
         */
        public add: GameObjectFactory;

        /**
         * Reference to the input manager
         * @type {Input}
         */
        public input: Input;

        /**
         * Reference to the assets loader.
         * @type {Loader}
         */
        public loader: Loader;

        /**
         * Reference to the math helper.
         * @type {GameMath}
         */
        public math: GameMath;

        /**
         * Reference to the motion helper.
         * @type {Motion}
         */
        public motion: Motion;

        /**
         * Reference to the sound manager.
         * @type {SoundManager}
         */
        public sound: SoundManager;

        /**
         * Reference to the stage.
         * @type {Stage}
         */
        public stage: Stage;

        /**
         * Reference to game clock.
         * @type {Time}
         */
        public time: Time;

        /**
         * Reference to the tween manager.
         * @type {TweenManager}
         */
        public tweens: TweenManager;

        /**
         * Reference to the world.
         * @type {World}
         */
        public world: World;

        //  Override these in your own States

        /**
         * Override this method to add some load operations.
         * If you need to use the loader, you may need to use them here.
         */
        public init() { }

        /**
         * This method is called after the game engine successfully switches states.
         * Feel free to add any setup code here.(Do not load anything here, override init() instead)
         */
        public create() { }

        /**
         * Put update logic here.
         */
        public update() { }

        /**
         * Put render operations here.
         */
        public render() { }

        /**
         * This method will be called when game paused.
         */
        public paused() { }

        /**
         * This method will be called when the state is destroyed
         */
        public destroy() { }

        /**
         * Call this method to see if one object collids another.
         * @return {boolean} Whether the given objects or groups collids.
         */
        public collide(ObjectOrGroup1: Basic = null, ObjectOrGroup2: Basic = null, NotifyCallback = null): bool {
            return this.collision.overlap(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, Collision.separate);
        }

    }

}