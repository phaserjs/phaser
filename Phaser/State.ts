/// <reference path="_definitions.ts" />

/**
 * State
 *
 * This is a base State class which can be extended if you are creating your game with TypeScript.
 * It provides quick access to common functions such as the camera, cache, input, match, sound and more.
 *
 * @package    Phaser.State
 * @author     Richard Davey <rich@photonstorm.com>
 * @copyright  2013 Photon Storm Ltd.
 * @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
 */

module Phaser {

    export class State {

        /**
         * State constructor
         * Create a new <code>State</code>.
         */
        constructor(game: Phaser.Game) {

            this.game = game;

            this.add = game.add;
            this.camera = game.camera;
            this.cache = game.cache;
            this.input = game.input;
            this.load = game.load;
            this.math = game.math;
            this.sound = game.sound;
            this.stage = game.stage;
            this.time = game.time;
            this.tweens = game.tweens;
            this.world = game.world;

        }

        /**
         * Reference to Game.
         */
        public game: Phaser.Game;

        /**
         * Currently used camera.
         * @type {Camera}
         */
        public camera: Phaser.Camera;

        /**
         * Reference to the assets cache.
         * @type {Cache}
         */
        public cache: Phaser.Cache;

        /**
         * Reference to the GameObject Factory.
         * @type {GameObjectFactory}
         */
        public add: Phaser.GameObjectFactory;

        /**
         * Reference to the input manager
         * @type {Input}
         */
        public input: Phaser.InputManager;

        /**
         * Reference to the assets loader.
         * @type {Loader}
         */
        public load: Phaser.Loader;

        /**
         * Reference to the math helper.
         * @type {GameMath}
         */
        public math: Phaser.GameMath;

        /**
         * Reference to the sound manager.
         * @type {SoundManager}
         */
        public sound: Phaser.SoundManager;

        /**
         * Reference to the stage.
         * @type {Stage}
         */
        public stage: Phaser.Stage;

        /**
         * Reference to game clock.
         * @type {Time}
         */
        public time: Phaser.TimeManager;

        /**
         * Reference to the tween manager.
         * @type {TweenManager}
         */
        public tweens: Phaser.TweenManager;

        /**
         * Reference to the world.
         * @type {World}
         */
        public world: Phaser.World;

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
         * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
         * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
         * @param object1 The first GameObject or Group to check. If null the world.group is used.
         * @param object2 The second GameObject or Group to check.
         * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
         * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
         * @param context The context in which the callbacks will be called
         * @returns {boolean} true if the objects overlap, otherwise false.
         */
        //public collide(objectOrGroup1 = null, objectOrGroup2 = null, notifyCallback = null, context? = this.game.callbackContext): boolean {
        //    return this.collision.overlap(objectOrGroup1, objectOrGroup2, notifyCallback, Collision.separate, context);
        //}

    }

}