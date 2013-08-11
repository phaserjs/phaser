/// <reference path="Game.ts" />
/**
* Phaser - Basic
*
* A useful "generic" object on which all GameObjects and Groups are based.
* It has no size, position or graphical data.
*/
var Phaser;
(function (Phaser) {
    var Basic = (function () {
        /**
        * Instantiate the basic object.
        */
        function Basic(game) {
            /**
            * Allows you to give this object a name. Useful for debugging, but not actually used internally.
            */
            this.name = '';
            this._game = game;
            this.ID = -1;
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.isGroup = false;
            this.ignoreGlobalUpdate = false;
            this.ignoreGlobalRender = false;
            this.ignoreDrawDebug = false;
        }
        Basic.prototype.destroy = /**
        * Override this to null out iables or manually call
        * <code>destroy()</code> on class members if necessary.
        * Don't forget to call <code>super.destroy()</code>!
        */
        function () {
        };
        Basic.prototype.preUpdate = /**
        * Pre-update is called right before <code>update()</code> on each object in the game loop.
        */
        function () {
        };
        Basic.prototype.update = /**
        * Override this to update your class's position and appearance.
        * This is where most of your game rules and behavioral code will go.
        */
        function (forceUpdate) {
            if (typeof forceUpdate === "undefined") { forceUpdate = false; }
        };
        Basic.prototype.postUpdate = /**
        * Post-update is called right after <code>update()</code> on each object in the game loop.
        */
        function () {
        };
        Basic.prototype.render = function (camera, cameraOffsetX, cameraOffsetY, forceRender) {
            if (typeof forceRender === "undefined") { forceRender = false; }
        };
        Basic.prototype.kill = /**
        * Handy for "killing" game objects.
        * Default behavior is to flag them as nonexistent AND dead.
        * However, if you want the "corpse" to remain in the game,
        * like to animate an effect or whatever, you should override this,
        * setting only alive to false, and leaving exists true.
        */
        function () {
            this.alive = false;
            this.exists = false;
        };
        Basic.prototype.revive = /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        function () {
            this.alive = true;
            this.exists = true;
        };
        Basic.prototype.toString = /**
        * Convert object to readable string name.  Useful for debugging, save games, etc.
        */
        function () {
            return "";
        };
        return Basic;
    })();
    Phaser.Basic = Basic;    
})(Phaser || (Phaser = {}));
