/// <reference path="Game.ts" />

/**
 * This is a useful "generic" object.
 * Both <code>GameObject</code> and <code>Group</code> extend this class,
 * as do the plugins.  Has no size, position or graphical data.
 * 
 * @author	Adam Atomic
 * @author	Richard Davey
 */

/**
*   Phaser
*/

module Phaser {

    export class Basic {

        /**
         * Instantiate the basic object.
         */
        constructor(game: Game) {

            this._game = game;
            this.ID = -1;
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.isGroup = false;
            this.ignoreDrawDebug = false;

        }

        /**
         * The essential reference to the main game object
         */
        public _game: Game;

        /**
         * Allows you to give this object a name. Useful for debugging, but not actually used internally.
         */
        public name: string = '';

        /**
         * IDs seem like they could be pretty useful, huh?
         * They're not actually used for anything yet though.
         */
        public ID: number;

        /**
         * A boolean to store if this object is a Group or not.
         * Saves us an expensive typeof check inside of core loops.
         */
        public isGroup: bool;

        /**
         * Controls whether <code>update()</code> and <code>draw()</code> are automatically called by FlxState/FlxGroup.
         */
        public exists: bool;

        /**
         * Controls whether <code>update()</code> is automatically called by FlxState/FlxGroup.
         */
        public active: bool;

        /**
         * Controls whether <code>draw()</code> is automatically called by FlxState/FlxGroup.
         */
        public visible: bool;

        /**
         * Useful state for many game objects - "dead" (!alive) vs alive.
         * <code>kill()</code> and <code>revive()</code> both flip this switch (along with exists, but you can override that).
         */
        public alive: bool;

        /**
         * Setting this to true will prevent the object from appearing
         * when the visual debug mode in the debugger overlay is toggled on.
         */
        public ignoreDrawDebug: bool;

        /**
         * Override this to null out iables or manually call
         * <code>destroy()</code> on class members if necessary.
         * Don't forget to call <code>super.destroy()</code>!
         */
        public destroy() { }

        /**
         * Pre-update is called right before <code>update()</code> on each object in the game loop.
         */
        public preUpdate() {
        }

        /**
         * Override this to update your class's position and appearance.
         * This is where most of your game rules and behavioral code will go.
         */
        public update() {
        }

        /**
         * Post-update is called right after <code>update()</code> on each object in the game loop.
         */
        public postUpdate() {
        }

        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number) {
        }

        /**
         * Handy for "killing" game objects.
         * Default behavior is to flag them as nonexistent AND dead.
         * However, if you want the "corpse" to remain in the game,
         * like to animate an effect or whatever, you should override this,
         * setting only alive to false, and leaving exists true.
         */
        public kill() {
            this.alive = false;
            this.exists = false;
        }

        /**
         * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
         * In practice, this is most often called by <code>FlxObject.reset()</code>.
         */
        public revive() {
            this.alive = true;
            this.exists = true;
        }

        /**
         * Convert object to readable string name.  Useful for debugging, save games, etc.
         */
        public toString(): string {
            return "";
        }

    }

}