/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Circle = require('../geom/circle/Circle');
var CircleContains = require('../geom/circle/Contains');
var Class = require('../utils/Class');
var DistanceBetween = require('../math/distance/DistanceBetween');
var Ellipse = require('../geom/ellipse/Ellipse');
var EllipseContains = require('../geom/ellipse/Contains');
var EventEmitter = require('eventemitter3');
var InteractiveObject = require('./InteractiveObject');
var PluginManager = require('../boot/PluginManager');
var Rectangle = require('../geom/rectangle/Rectangle');
var RectangleContains = require('../geom/rectangle/Contains');
var Triangle = require('../geom/triangle/Triangle');
var TriangleContains = require('../geom/triangle/Contains');

/**
 * @classdesc
 * [description]
 *
 * @class InputPlugin
 * @extends EventEmitter
 * @memberOf Phaser.Input
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that owns this plugin.
 */
var InputPlugin = new Class({

    Extends: EventEmitter,

    initialize:

    function InputPlugin (scene)
    {
        EventEmitter.call(this);

        /**
         * The Scene that owns this plugin.
         *
         * @name Phaser.Input.InputPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Input.InputPlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        /**
         * [description]
         *
         * @name Phaser.Input.InputPlugin#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = scene.sys.game.input;

        /**
         * A reference to this.scene.sys.displayList (set in boot)
         *
         * @name Phaser.Input.InputPlugin#displayList
         * @type {Phaser.GameObjects.DisplayList}
         * @since 3.0.0
         */
        this.displayList;

        /**
         * A reference to the this.scene.sys.cameras (set in boot)
         *
         * @name Phaser.Input.InputPlugin#cameras
         * @type {null}
         * @since 3.0.0
         */
        this.cameras;

        /**
         * [description]
         *
         * @name Phaser.Input.InputPlugin#keyboard
         * @type {Phaser.Input.Keyboard.KeyboardManager}
         * @since 3.0.0
         */
        this.keyboard = this.manager.keyboard;

        /**
         * [description]
         *
         * @name Phaser.Input.InputPlugin#mouse
         * @type {Phaser.Input.Mouse.MouseManager}
         * @since 3.0.0
         */
        this.mouse = this.manager.mouse;

        /**
         * [description]
         *
         * @name Phaser.Input.InputPlugin#gamepad
         * @type {Phaser.Input.Gamepad.GamepadManager}
         * @since 3.0.0
         */
        this.gamepad = this.manager.gamepad;

        /**
         * Only fire callbacks and events on the top-most Game Object in the display list (emulating DOM behavior)
         * and ignore any GOs below it, or call them all?
         *
         * @name Phaser.Input.InputPlugin#topOnly
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.topOnly = true;

        /**
         * How often should the pointer input be checked?
         * Time given in ms
         * Pointer will *always* be checked if it has been moved by the user.
         * This controls how often it will be polled if it hasn't been moved.
         * Set to 0 to poll constantly. Set to -1 to only poll on user movement.
         *
         * @name Phaser.Input.InputPlugin#pollRate
         * @type {integer}
         * @default -1
         * @since 3.0.0
         */
        this.pollRate = -1;

        /**
         * [description]
         *
         * @name Phaser.Input.InputPlugin#_pollTimer
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._pollTimer = 0;

        /**
         * The distance, in pixels, the pointer has to move while being held down, before it thinks it is being dragged.
         *
         * @name Phaser.Input.InputPlugin#dragDistanceThreshold
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.dragDistanceThreshold = 0;

        /**
         * The amount of time, in ms, the pointer has to be held down before it thinks it is dragging.
         *
         * @name Phaser.Input.InputPlugin#dragTimeThreshold
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.dragTimeThreshold = 0;

        /**
         * Used to temporarily store the results of the Hit Test
         *
         * @name Phaser.Input.InputPlugin#_temp
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._temp = [];

        /**
         * A list of all Game Objects that have been set to be interactive.
         *
         * @name Phaser.Input.InputPlugin#_list
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._list = [];

        /**
         * Objects waiting to be inserted to the list on the next call to 'begin'.
         *
         * @name Phaser.Input.InputPlugin#_pendingInsertion
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingInsertion = [];

        /**
         * Objects waiting to be removed from the list on the next call to 'begin'.
         *
         * @name Phaser.Input.InputPlugin#_pendingRemoval
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingRemoval = [];

        /**
         * A list of all Game Objects that have been enabled for dragging.
         *
         * @name Phaser.Input.InputPlugin#_draggable
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._draggable = [];

        /**
         * A list of all Interactive Objects currently considered as being 'draggable' by any pointer, indexed by pointer ID.
         *
         * @name Phaser.Input.InputPlugin#_drag
         * @type {[type]}
         * @private
         * @since 3.0.0
         */
        this._drag = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

        /**
         * A list of all Interactive Objects currently considered as being 'over' by any pointer, indexed by pointer ID.
         *
         * @name Phaser.Input.InputPlugin#_over
         * @type {[type]}
         * @private
         * @since 3.0.0
         */
        this._over = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

        /**
         * [description]
         *
         * @name Phaser.Input.InputPlugin#_validTypes
         * @type {[type]}
         * @private
         * @since 3.0.0
         */
        this._validTypes = [ 'onDown', 'onUp', 'onOver', 'onOut', 'onMove', 'onDragStart', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragLeave', 'onDragOver', 'onDrop' ];
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);

        this.cameras = this.systems.cameras;

        this.displayList = this.systems.displayList;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#preUpdate
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    preUpdate: function ()
    {
        var removeList = this._pendingRemoval;
        var insertList = this._pendingInsertion;

        var toRemove = removeList.length;
        var toInsert = insertList.length;

        if (toRemove === 0 && toInsert === 0)
        {
            //  Quick bail
            return;
        }

        var current = this._list;

        //  Delete old gameObjects
        for (var i = 0; i < toRemove; i++)
        {
            var gameObject = removeList[i];

            var index = current.indexOf(gameObject);

            if (index > -1)
            {
                current.splice(index, 1);

                //  TODO: Clear from _draggable, _drag and _over too

                this.clear(gameObject);
            }
        }

        //  Clear the removal list
        removeList.length = 0;

        //  Move pendingInsertion to list (also clears pendingInsertion at the same time)
        this._list = current.concat(insertList.splice(0));
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#clear
     * @since 3.0.0
     *
     * @param {[type]} gameObject - [description]
     *
     * @return {[type]} [description]
     */
    clear: function (gameObject)
    {
        var input = gameObject.input;

        input.gameObject = undefined;
        input.target = undefined;
        input.hitArea = undefined;
        input.hitAreaCallback = undefined;
        input.callbackContext = undefined;

        gameObject.input = null;

        return gameObject;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#disable
     * @since 3.0.0
     *
     * @param {[type]} gameObject - [description]
     */
    disable: function (gameObject)
    {
        gameObject.input.enabled = false;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#enable
     * @since 3.0.0
     *
     * @param {[type]} gameObject - [description]
     * @param {[type]} shape - [description]
     * @param {[type]} callback - [description]
     *
     * @return {[type]} [description]
     */
    enable: function (gameObject, shape, callback)
    {
        if (gameObject.input)
        {
            //  If it is already has an InteractiveObject then just enable it and return
            gameObject.input.enabled = true;
        }
        else
        {
            //  Create an InteractiveObject and enable it
            this.setHitArea(gameObject, shape, callback);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#hitTestPointer
     * @since 3.0.0
     *
     * @param {[type]} pointer - [description]
     *
     * @return {[type]} [description]
     */
    hitTestPointer: function (pointer)
    {
        var camera = this.cameras.getCameraBelowPointer(pointer);

        if (camera)
        {
            pointer.camera = camera;

            //  Get a list of all objects that can be seen by the camera below the pointer in the scene and store in 'output' array.
            //  All objects in this array are input enabled, as checked by the hitTest method, so we don't need to check later on as well.
            return this.manager.hitTest(pointer.x, pointer.y, this._list, camera);
        }
        else
        {
            return [];
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#processDownEvents
     * @since 3.0.0
     *
     * @param {[type]} pointer - [description]
     *
     * @return {[type]} [description]
     */
    processDownEvents: function (pointer)
    {
        var currentlyOver = this._temp;

        //  Contains ALL Game Objects currently over in the array
        this.emit('pointerdown', pointer, currentlyOver);

        var total = 0;

        //  Go through all objects the pointer was over and fire their events / callbacks
        for (var i = 0; i < currentlyOver.length; i++)
        {
            var gameObject = currentlyOver[i];

            if (!gameObject.input)
            {
                continue;
            }

            total++;

            gameObject.emit('pointerdown', pointer, gameObject.input.localX, gameObject.input.localY, pointer.camera);

            this.emit('gameobjectdown', pointer, gameObject);
        }

        return total;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#processDragEvents
     * @since 3.0.0
     *
     * @param {[type]} pointer - [description]
     * @param {[type]} time - [description]
     *
     * @return {[type]} [description]
     */
    processDragEvents: function (pointer, time)
    {
        if (this._draggable.length === 0)
        {
            //  There are no draggable items, so let's not even bother going further
            return 0;
        }

        var i;
        var c;
        var gameObject;
        var list;
        var input;
        var currentlyOver = this._temp;

        //  0 = Not dragging anything
        //  1 = Primary button down and objects below, so collect a draglist
        //  2 = Pointer being checked if meets drag criteria
        //  3 = Pointer meets criteria, notify the draglist
        //  4 = Pointer actively dragging the draglist and has moved
        //  5 = Pointer actively dragging but has been released, notify draglist

        if (pointer.dragState === 0 && pointer.primaryDown && pointer.justDown && currentlyOver.length > 0)
        {
            pointer.dragState = 1;
        }
        else if (pointer.dragState > 0 && !pointer.primaryDown && pointer.justUp)
        {
            pointer.dragState = 5;
        }

        //  Process the various drag states

        //  1 = Primary button down and objects below, so collect a draglist
        if (pointer.dragState === 1)
        {
            //  Get draggable objects, sort them, pick the top (or all) and store them somewhere
            var draglist = [];

            for (i = 0; i < currentlyOver.length; i++)
            {
                gameObject = currentlyOver[i];

                if (gameObject.input.draggable)
                {
                    draglist.push(gameObject);
                }
            }

            if (draglist.length === 0)
            {
                pointer.dragState = 0;

                return;
            }
            else if (draglist.length > 1)
            {
                this.sortGameObjects(draglist);

                if (this.topOnly)
                {
                    draglist.splice(1);
                }
            }

            //  draglist now contains all potential candidates for dragging
            this._drag[pointer.id] = draglist;

            if (this.dragDistanceThreshold === 0 && this.dragTimeThreshold === 0)
            {
                //  No drag criteria, so snap immediately to mode 3
                pointer.dragState = 3;
            }
            else
            {
                //  Check the distance / time
                pointer.dragState = 2;
            }
        }

        //  2 = Pointer being checked if meets drag criteria
        if (pointer.dragState === 2)
        {
            //  Has it moved far enough to be considered a drag?
            if (this.dragDistanceThreshold > 0 && DistanceBetween(pointer.x, pointer.y, pointer.downX, pointer.downY) >= this.dragDistanceThreshold)
            {
                //  Alrighty, we've got a drag going on ...
                pointer.dragState = 3;
            }

            //  Held down long enough to be considered a drag?
            if (this.dragTimeThreshold > 0 && (time >= pointer.downTime + this.dragTimeThreshold))
            {
                //  Alrighty, we've got a drag going on ...
                pointer.dragState = 3;
            }
        }

        //  3 = Pointer meets criteria and is freshly down, notify the draglist
        if (pointer.dragState === 3)
        {
            list = this._drag[pointer.id];

            for (i = 0; i < list.length; i++)
            {
                gameObject = list[i];

                input = gameObject.input;

                input.dragState = 2;

                input.dragX = pointer.x - gameObject.x;
                input.dragY = pointer.y - gameObject.y;

                input.dragStartX = gameObject.x;
                input.dragStartY = gameObject.y;

                gameObject.emit('dragstart', pointer, input.dragX, input.dragY);

                this.emit('dragstart', pointer, gameObject);
            }

            pointer.dragState = 4;

            return;
        }

        //  4 = Pointer actively dragging the draglist and has moved
        if (pointer.dragState === 4 && pointer.justMoved)
        {
            //  Let's filter out currentlyOver for dropZones only
            var dropZones = [];

            for (c = 0; c < currentlyOver.length; c++)
            {
                if (currentlyOver[c].input.dropZone)
                {
                    dropZones.push(currentlyOver[c]);
                }
            }

            list = this._drag[pointer.id];

            for (i = 0; i < list.length; i++)
            {
                gameObject = list[i];

                input = gameObject.input;

                //  If this GO has a target then let's check it
                if (input.target)
                {
                    var index = dropZones.indexOf(input.target);

                    //  Got a target, are we still over it?
                    if (index === 0)
                    {
                        //  We're still over it, and it's still the top of the display list, phew ...
                        gameObject.emit('dragover', pointer, input.target);

                        this.emit('dragover', pointer, gameObject, input.target);
                    }
                    else if (index > 0)
                    {
                        //  Still over it but it's no longer top of the display list (targets must always be at the top)
                        gameObject.emit('dragleave', pointer, input.target);

                        this.emit('dragleave', pointer, gameObject, input.target);

                        input.target = dropZones[0];

                        gameObject.emit('dragenter', pointer, input.target);

                        this.emit('dragenter', pointer, gameObject, input.target);
                    }
                    else
                    {
                        //  Nope, we've moved on (or the target has!), leave the old target
                        gameObject.emit('dragleave', pointer, input.target);

                        this.emit('dragleave', pointer, gameObject, input.target);

                        //  Anything new to replace it?
                        //  Yup!
                        if (dropZones[0])
                        {
                            input.target = dropZones[0];

                            gameObject.emit('dragenter', pointer, input.target);

                            this.emit('dragenter', pointer, gameObject, input.target);
                        }
                        else
                        {
                            //  Nope
                            input.target = null;
                        }
                    }
                }
                else if (!input.target && dropZones[0])
                {
                    input.target = dropZones[0];

                    gameObject.emit('dragenter', pointer, input.target);

                    this.emit('dragenter', pointer, gameObject, input.target);
                }

                var dragX = pointer.x - gameObject.input.dragX;
                var dragY = pointer.y - gameObject.input.dragY;

                gameObject.emit('drag', pointer, dragX, dragY);

                this.emit('drag', pointer, gameObject, dragX, dragY);
            }
        }

        //  5 = Pointer actively dragging but has been released, notify draglist
        if (pointer.dragState === 5)
        {
            list = this._drag[pointer.id];

            for (i = 0; i < list.length; i++)
            {
                gameObject = list[i];

                input = gameObject.input;

                input.dragState = 0;

                input.dragX = input.localX - gameObject.displayOriginX;
                input.dragY = input.localY - gameObject.displayOriginY;

                var dropped = false;

                if (input.target)
                {
                    gameObject.emit('drop', pointer, input.target);

                    this.emit('drop', pointer, gameObject, input.target);

                    input.target = null;

                    dropped = true;
                }

                //  And finally the dragend event

                gameObject.emit('dragend', pointer, input.dragX, input.dragY, dropped);

                this.emit('dragend', pointer, gameObject, dropped);
            }

            pointer.dragState = 0;
        }
        
        return (pointer.dragState > 0);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#processMoveEvents
     * @since 3.0.0
     *
     * @param {[type]} pointer - [description]
     *
     * @return {[type]} [description]
     */
    processMoveEvents: function (pointer)
    {
        var currentlyOver = this._temp;

        this.emit('pointermove', pointer, currentlyOver);

        var total = 0;

        //  Go through all objects the pointer was over and fire their events / callbacks
        for (var i = 0; i < currentlyOver.length; i++)
        {
            var gameObject = currentlyOver[i];

            if (!gameObject.input)
            {
                continue;
            }

            total++;

            gameObject.emit('pointermove', pointer, gameObject.input.localX, gameObject.input.localY);

            this.emit('gameobjectmove', pointer, gameObject);

            if (this.topOnly)
            {
                break;
            }
        }

        return total;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#processOverOutEvents
     * @since 3.0.0
     *
     * @param {[type]} pointer - [description]
     *
     * @return {[type]} [description]
     */
    processOverOutEvents: function (pointer)
    {
        var currentlyOver = this._temp;

        var i;
        var gameObject;
        var justOut = [];
        var justOver = [];
        var stillOver = [];
        var previouslyOver = this._over[pointer.id];

        //  Go through all objects the pointer was previously over, and see if it still is.
        //  Splits the previouslyOver array into two parts: justOut and stillOver

        for (i = 0; i < previouslyOver.length; i++)
        {
            gameObject = previouslyOver[i];

            if (currentlyOver.indexOf(gameObject) === -1)
            {
                //  Not in the currentlyOver array, so must be outside of this object now
                justOut.push(gameObject);
            }
            else
            {
                //  In the currentlyOver array
                stillOver.push(gameObject);
            }
        }

        //  Go through all objects the pointer is currently over (the hit test results)
        //  and if not in the previouslyOver array we know it's a new entry, so add to justOver
        for (i = 0; i < currentlyOver.length; i++)
        {
            gameObject = currentlyOver[i];

            //  Is this newly over?

            if (previouslyOver.indexOf(gameObject) === -1)
            {
                justOver.push(gameObject);
            }
        }

        //  By this point the arrays are filled, so now we can process what happened...

        //  Process the Just Out objects
        var total = justOut.length;

        if (total > 0)
        {
            this.sortGameObjects(justOut);

            this.emit('pointerout', pointer, justOut);

            //  Call onOut for everything in the justOut array
            for (i = 0; i < total; i++)
            {
                gameObject = justOut[i];

                if (!gameObject.input)
                {
                    continue;
                }

                this.emit('gameobjectout', pointer, gameObject);

                gameObject.emit('pointerout', pointer);
            }
        }

        //  Process the Just Over objects
        total = justOver.length;

        if (total > 0)
        {
            this.sortGameObjects(justOver);

            this.emit('pointerover', pointer, justOver);

            //  Call onOver for everything in the justOver array
            for (i = 0; i < total; i++)
            {
                gameObject = justOver[i];

                if (!gameObject.input)
                {
                    continue;
                }

                this.emit('gameobjectover', pointer, gameObject);

                gameObject.emit('pointerover', pointer, gameObject.input.localX, gameObject.input.localY);
            }
        }

        //  Add the contents of justOver to the previously over array
        previouslyOver = stillOver.concat(justOver);

        //  Then sort it into display list order
        this._over[pointer.id] = this.sortGameObjects(previouslyOver);

        return previouslyOver.length;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#processUpEvents
     * @since 3.0.0
     *
     * @param {[type]} pointer - [description]
     */
    processUpEvents: function (pointer)
    {
        var currentlyOver = this._temp;

        //  Contains ALL Game Objects currently up in the array
        this.emit('pointerup', pointer, currentlyOver);

        //  Go through all objects the pointer was over and fire their events / callbacks
        for (var i = 0; i < currentlyOver.length; i++)
        {
            var gameObject = currentlyOver[i];

            if (!gameObject.input)
            {
                continue;
            }

            gameObject.emit('pointerup', pointer, gameObject.input.localX, gameObject.input.localY);

            this.emit('gameobjectup', pointer, gameObject);
        }
    },

    /**
     * Queues a Game Object for insertion into this Input Manager on the next update.
     *
     * @method Phaser.Input.InputPlugin#queueForInsertion
     * @since 3.0.0
     *
     * @param {[type]} child - [description]
     *
     * @return {[type]} [description]
     */
    queueForInsertion: function (child)
    {
        if (this._pendingInsertion.indexOf(child) === -1 && this._list.indexOf(child) === -1)
        {
            this._pendingInsertion.push(child);
        }

        return this;
    },

    /**
     * Queues a Game Object for removal from this Input Manager on the next update.
     *
     * @method Phaser.Input.InputPlugin#queueForRemoval
     * @since 3.0.0
     *
     * @param {[type]} child - [description]
     *
     * @return {[type]} [description]
     */
    queueForRemoval: function (child)
    {
        this._pendingRemoval.push(child);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setDraggable
     * @since 3.0.0
     *
     * @param {[type]} gameObjects - [description]
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setDraggable: function (gameObjects, value)
    {
        if (value === undefined) { value = true; }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            gameObject.input.draggable = value;

            var index = this._draggable.indexOf(gameObject);

            if (value && index === -1)
            {
                this._draggable.push(gameObject);
            }
            else if (!value && index > -1)
            {
                this._draggable.splice(index, 1);
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setHitArea
     * @since 3.0.0
     *
     * @param {[type]} gameObjects - [description]
     * @param {[type]} shape - [description]
     * @param {[type]} callback - [description]
     *
     * @return {[type]} [description]
     */
    setHitArea: function (gameObjects, shape, callback)
    {
        if (shape === undefined)
        {
            return this.setHitAreaFromTexture(gameObjects);
        }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            gameObject.input = InteractiveObject(gameObject, shape, callback);

            this.queueForInsertion(gameObject);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setHitAreaCircle
     * @since 3.0.0
     *
     * @param {[type]} gameObjects - [description]
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} radius - [description]
     * @param {[type]} callback - [description]
     *
     * @return {[type]} [description]
     */
    setHitAreaCircle: function (gameObjects, x, y, radius, callback)
    {
        if (callback === undefined) { callback = CircleContains; }

        var shape = new Circle(x, y, radius);

        return this.setHitArea(gameObjects, shape, callback);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setHitAreaEllipse
     * @since 3.0.0
     *
     * @param {[type]} gameObjects - [description]
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     * @param {[type]} callback - [description]
     *
     * @return {[type]} [description]
     */
    setHitAreaEllipse: function (gameObjects, x, y, width, height, callback)
    {
        if (callback === undefined) { callback = EllipseContains; }

        var shape = new Ellipse(x, y, width, height);

        return this.setHitArea(gameObjects, shape, callback);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setHitAreaFromTexture
     * @since 3.0.0
     *
     * @param {[type]} gameObjects - [description]
     * @param {[type]} callback - [description]
     *
     * @return {[type]} [description]
     */
    setHitAreaFromTexture: function (gameObjects, callback)
    {
        if (callback === undefined) { callback = RectangleContains; }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];
            var frame = gameObject.frame;

            var width = 0;
            var height = 0;

            if (frame)
            {
                width = frame.realWidth;
                height = frame.realHeight;
            }
            else if (gameObject.width)
            {
                width = gameObject.width;
                height = gameObject.height;
            }

            if (width !== 0 && height !== 0)
            {
                gameObject.input = InteractiveObject(gameObject, new Rectangle(0, 0, width, height), callback);

                this.queueForInsertion(gameObject);
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setHitAreaRectangle
     * @since 3.0.0
     *
     * @param {[type]} gameObjects - [description]
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     * @param {[type]} callback - [description]
     *
     * @return {[type]} [description]
     */
    setHitAreaRectangle: function (gameObjects, x, y, width, height, callback)
    {
        if (callback === undefined) { callback = RectangleContains; }

        var shape = new Rectangle(x, y, width, height);

        return this.setHitArea(gameObjects, shape, callback);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setHitAreaTriangle
     * @since 3.0.0
     *
     * @param {[type]} gameObjects - [description]
     * @param {[type]} x1 - [description]
     * @param {[type]} y1 - [description]
     * @param {[type]} x2 - [description]
     * @param {[type]} y2 - [description]
     * @param {[type]} x3 - [description]
     * @param {[type]} y3 - [description]
     * @param {[type]} callback - [description]
     *
     * @return {[type]} [description]
     */
    setHitAreaTriangle: function (gameObjects, x1, y1, x2, y2, x3, y3, callback)
    {
        if (callback === undefined) { callback = TriangleContains; }

        var shape = new Triangle(x1, y1, x2, y2, x3, y3);

        return this.setHitArea(gameObjects, shape, callback);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setPollAlways
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setPollAlways: function ()
    {
        this.pollRate = 0;
        this._pollTimer = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setPollOnMove
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setPollOnMove: function ()
    {
        this.pollRate = -1;
        this._pollTimer = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setPollRate
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setPollRate: function (value)
    {
        this.pollRate = value;
        this._pollTimer = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setGlobalTopOnly
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setGlobalTopOnly: function (value)
    {
        this.manager.globalTopOnly = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#setTopOnly
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setTopOnly: function (value)
    {
        this.topOnly = value;

        return this;
    },

    /**
     * Given an array of Game Objects, sort the array and return it,
     * so that the objects are in index order with the lowest at the bottom.
     *
     * @method Phaser.Input.InputPlugin#sortGameObjects
     * @since 3.0.0
     *
     * @param {[type]} gameObjects - [description]
     *
     * @return {[type]} [description]
     */
    sortGameObjects: function (gameObjects)
    {
        if (gameObjects.length < 2)
        {
            return gameObjects;
        }

        this.scene.sys.depthSort();

        return gameObjects.sort(this.sortHandlerGO.bind(this));
    },

    /**
     * Return the child lowest down the display list (with the smallest index)
     *
     * @method Phaser.Input.InputPlugin#sortHandlerGO
     * @since 3.0.0
     *
     * @param {[type]} childA - [description]
     * @param {[type]} childB - [description]
     *
     * @return {[type]} [description]
     */
    sortHandlerGO: function (childA, childB)
    {
        //  The higher the index, the lower down the display list they are.
        //  So entry 0 will be the top-most item (visually)
        var indexA = this.displayList.getIndex(childA);
        var indexB = this.displayList.getIndex(childB);

        if (indexA < indexB)
        {
            return 1;
        }
        else if (indexA > indexB)
        {
            return -1;
        }

        //  Technically this shouldn't happen, but if the GO wasn't part of this display list then it'll
        //  have an index of -1, so in some cases it can
        return 0;
    },

    /**
     * Return the child lowest down the display list (with the smallest index)
     *
     * @method Phaser.Input.InputPlugin#sortHandlerIO
     * @since 3.0.0
     *
     * @param {[type]} childA - [description]
     * @param {[type]} childB - [description]
     *
     * @return {[type]} [description]
     */
    sortHandlerIO: function (childA, childB)
    {
        //  The higher the index, the lower down the display list they are.
        //  So entry 0 will be the top-most item (visually)
        var indexA = this.displayList.getIndex(childA.gameObject);
        var indexB = this.displayList.getIndex(childB.gameObject);

        if (indexA < indexB)
        {
            return 1;
        }
        else if (indexA > indexB)
        {
            return -1;
        }

        //  Technically this shouldn't happen, but if the GO wasn't part of this display list then it'll
        //  have an index of -1, so in some cases it can
        return 0;
    },

    /**
     * Given an array of Interactive Objects, sort the array and return it,
     * so that the objects are in index order with the lowest at the bottom.
     *
     * @method Phaser.Input.InputPlugin#sortInteractiveObjects
     * @since 3.0.0
     *
     * @param {[type]} interactiveObjects - [description]
     *
     * @return {[type]} [description]
     */
    sortInteractiveObjects: function (interactiveObjects)
    {
        if (interactiveObjects.length < 2)
        {
            return interactiveObjects;
        }

        this.scene.sys.depthSort();

        return interactiveObjects.sort(this.sortHandlerIO.bind(this));
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#stopPropagation
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    stopPropagation: function ()
    {
        if (this.manager.globalTopOnly)
        {
            this.manager.ignoreEvents = true;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#update
     * @since 3.0.0
     *
     * @param {[type]} time - [description]
     * @param {[type]} delta - [description]
     *
     * @return {[type]} [description]
     */
    update: function (time, delta)
    {
        var manager = this.manager;

        //  Another Scene above this one has already consumed the input events
        if (manager.globalTopOnly && manager.ignoreEvents)
        {
            return;
        }

        var pointer = manager.activePointer;

        var runUpdate = (pointer.dirty || this.pollRate === 0);

        if (this.pollRate > -1)
        {
            this._pollTimer -= delta;

            if (this._pollTimer < 0)
            {
                runUpdate = true;

                //  Discard timer diff
                this._pollTimer = this.pollRate;
            }
        }

        if (!runUpdate)
        {
            return;
        }

        this._temp = this.hitTestPointer(pointer);

        this.sortGameObjects(this._temp);

        if (this.topOnly && this._temp.length)
        {
            //  Only the top-most one counts now, so safely ignore the rest
            this._temp.splice(1);
        }

        var total = this.processDragEvents(pointer, time);

        if (!pointer.wasTouch)
        {
            total += this.processOverOutEvents(pointer);
        }

        if (pointer.justDown)
        {
            total += this.processDownEvents(pointer);
        }

        if (pointer.justUp)
        {
            this.processUpEvents(pointer);
        }

        if (pointer.justMoved)
        {
            total += this.processMoveEvents(pointer);
        }

        if (total > 0 && manager.globalTopOnly)
        {
            //  We interacted with an event in this Scene, so block any Scenes below us from doing the same this frame
            manager.ignoreEvents = true;
        }
    },

    /**
     * The Scene that owns this plugin is shutting down.
     *
     * @method Phaser.Input.InputPlugin#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this._temp.length = 0;
        this._list.length = 0;
        this._draggable.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;

        for (var i = 0; i < 10; i++)
        {
            this._drag[i] = [];
            this._over[i] = [];
        }

        this.removeAllListeners();
    },

    /**
     * [description]
     *
     * @method Phaser.Input.InputPlugin#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
        this.cameras = undefined;
        this.manager = undefined;
        this.events = undefined;
        this.keyboard = undefined;
        this.mouse = undefined;
        this.gamepad = undefined;
    },

    /**
     * The current active input Pointer.
     * 
     * @name Phaser.Input.InputPlugin#activePointer
     * @type {Phaser.Input.Pointer}
     * @readOnly
     * @since 3.0.0
     */
    activePointer: {

        get: function ()
        {
            return this.manager.activePointer;
        }

    },

    /**
     * The x coordinates of the ActivePointer based on the first camera in the camera list.
     * This is only safe to use if your game has just 1 non-transformed camera and doesn't use multi-touch.
     * 
     * @name Phaser.Input.InputPlugin#x
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this.manager.activePointer.x;
        }

    },

    /**
     * The y coordinates of the ActivePointer based on the first camera in the camera list.
     * This is only safe to use if your game has just 1 non-transformed camera and doesn't use multi-touch.
     * 
     * @name Phaser.Input.InputPlugin#y
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this.manager.activePointer.y;
        }

    }

});

PluginManager.register('InputPlugin', InputPlugin, 'input');

module.exports = InputPlugin;
