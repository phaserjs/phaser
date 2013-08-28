var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - Components - Events
    *
    * Signals that are dispatched by the Sprite and its various components
    */
    (function (Components) {
        var Events = (function () {
            /**
            * The Events component is a collection of events fired by the parent game object and its components.
            * @param parent The game object using this Input component
            */
            function Events(parent) {
                this.game = parent.game;
                this._parent = parent;
                this.onAddedToGroup = new Phaser.Signal();
                this.onRemovedFromGroup = new Phaser.Signal();
                this.onKilled = new Phaser.Signal();
                this.onRevived = new Phaser.Signal();
                this.onOutOfBounds = new Phaser.Signal();
            }
            return Events;
        })();
        Components.Events = Events;        
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
