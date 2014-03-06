/**
* @author       Antony Woods <antony@teamwoods.org>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - Gestures constructor.
*
* @class Phaser.Gestures
* @classdesc An object for controlling the detection of global gestures.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Gestures = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;
    
    /**
    * @property {boolean} active - If true, the Gestures class will attempt to detect gestures
    * @default
    */
    this.active = false;
    
    /**
    * @property {Array} _gestures - A list of gestures that we're currently tracking.
    * @default
    */
    this._gestures = [];
    
    /**
    * @property {Array} _pointers - A list of of pointers that are in the process of being detected
    * @default
    */
    this._pointers = [];
    
    /**
    * Update pointer state
    */
    this.game.input.setMoveCallback(function (pointer) {

        if (this.active)
        {
           this._updatePointerState(pointer);
        }
    }, this);

};

Phaser.Gestures.prototype = {

    /**
    * Add a new pointer and gesture type to the detection system
    * @method Phaser.Gestures#add
    * @param {Phaser.Gestures} gesture - a gesture that we wish to detect (i.e. Phaser.Gesture.SwipeLeft)
    * @param {function} onGestureUpdated - a callback for when the gesture updates (returns with valid data)
    */
    add: function (gesture, onGestureUpdated) {

        this.add(gesture, onGestureUpdated, null, null);

    },
    
    /**
    * Add a new pointer and gesture type to the detection system
    * @method Phaser.Gestures#add
    * @param {Phaser.Gestures} gesture - a gesture that we wish to detect (i.e. Phaser.Gesture.SwipeLeft)
    * @param {function} onGestureUpdated - a callback for when the gesture updates (returns with valid data)
    * @param {function} onGestureStarted - a callback for when the gesture starts (begins detection)
    * @param {function} onGestureStopped - a callback for when the gesture stops (ends detection)
    */
    add: function (gesture, onGestureUpdated, onGestureStarted, onGestureStopped) {

        var gestureObject = {
            gesture: new gesture(),
            hasStarted: false,
            onGestureStarted: onGestureStarted,
            onGestureUpdated: onGestureUpdated,
            onGestureStopped: onGestureStopped,
        }
        
        this._gestures.push(gestureObject);       

    },
    
    /**
    * Remove a pointer and gesture combination from the detection system
    * @method Phaser.Gestures#remove
    * @param {Phaser.Gestures} gesture - a gesture that we no longer wish to detect (i.e. Phaser.Gesture.SwipeLeft)
    */
    remove: function (gesture) {

        for (var i = this._gestures.length - 1; i >= 0; --i)
        {
            if (this._gestures[i].gesture.name == new gesture().name)
            {
                delete this._gestures[i];
            }
        }       

        this._gestures = this._gestures.filter(function(a){return typeof a !== 'undefined';});

    },
    
    /**
    * Update function, called whenever a pointer triggers an event.
    * @method Phaser.Gestures#update
    */
    update: function () {
    
        if (this.active && this._pointers.length > 0)
        {   
            var hasPointers = this._pointers.filter(function(p){return p.isDown;}).length > 0;

            for (var i = this._gestures.length - 1; i >= 0; --i)
            {
                if (!this._gestures[i].hasStarted)
                {
                    this._gestures[i].hasStarted = true;
                    this._gestures[i].gesture.start(this._pointers);

                    if (this._gestures[i].onGestureStarted != null)
                    {
                        this._gestures[i].onGestureStarted();
                    }
                }
                else
                {
                    var result = this._gestures[i].gesture.update(this._pointers);

                    if (result)
                    {
                        var data = this._gestures[i].gesture.getData();

                        if (this._gestures[i].onGestureUpdated != null)
                        {
                            this._gestures[i].onGestureUpdated(data);
                        }
                    }
                    if (!hasPointers)
                    {
                        this._gestures[i].gesture.stop(this._pointers);
                        this._gestures[i].hasStarted = false;

                        if (this._gestures[i].onGestureStopped != null)
                        {
                            this._gestures[i].onGestureStopped();
                        }
                    }
                }               
            }

            this._pointers = this._pointers.filter(function(p){return p.isDown;});
        }

    },
    
    /**
    * Updates internal pointer state
    * @method Phaser.Gestures#update
    * @param {Phaser.Pointer} pointer - the pointer that triggered this update
    */
    _updatePointerState: function (pointer) {
    
        var pointerObject = null;

        for (var i = this._pointers.length - 1; i >= 0; --i)
        {
            if (this._pointers[i].pointer == pointer)
            {
                pointerObject = this._pointers[i];
                break;
            }
        }

        if (pointerObject == null && pointer.isDown)
        {
            pointerObject = {
                pointer: pointer,
                justPressed: true,
                isUp: false,
                isDown: true
            }

            this._pointers.push(pointerObject);
        } 
        else if (pointerObject != null)
        {
            pointerObject.justPressed = false;
            pointerObject.isDown = pointer.isDown;
            pointerObject.isUp = pointer.isUp;
        }
    }

};

Phaser.Gestures.prototype.constructor = Phaser.Gestures;

/* ---------------------------------------- */

Phaser.Gestures.Helpers = {

    /**
    * Finds or creates a local 'pointer' object from a given array
    *
    * @method Phaser.Gestures.Helpers#createOrFindPointerData 
    * @param {Array} - an array of objects that expose 'pointer' as a field.
    * @param {Phaser.Point} - the pointer object we're attempting to find.
    */
    createOrFindPointerData: function(pointerArray, pointer) {

        var pointerObject = null;

        for (var i = pointerArray.length - 1; i >= 0; --i)
        {
            if (pointerArray[i].pointer == pointer)
            {
                pointerObject = pointerArray[i];
                break;
            }
        }

        if (pointerObject == null)
        {
            pointerObject = {
                pointer:pointer,
                isNew: true
            }

            pointerArray.push(pointerObject);
        } 

        return pointerObject;
    }

};

Phaser.Gesture = {};

/**
* Swipe-Left detection
*
* @class Phaser.Gesture.SwipeLeft
*/
Phaser.Gesture.SwipeLeft = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = game;
    
    /**
    * @property {String} - the name of the gesture
    * @default
    */
    this.name = "SwipeLeft";
    
    /**
    * @property {Array} _deltaXPerPointer - A list of delta X value for each pointer.
    * @default
    */
    this._pointerData = [];

};

Phaser.Gesture.SwipeLeft.prototype = {

    /** 
    * Find a pointer data object using the helper
    *
    * @method Phaser.Gesture.SwipeLeft#_createOrFindPointerData 
    * @param {Phaser.Pointer} - the pointer for which we want to retrieve data
    */
    _createOrFindPointerData: function (pointer) {

        var ptrObject = Phaser.Gestures.Helpers.createOrFindPointerData(this._pointerData, pointer);

        if (ptrObject.isNew)
        {
            ptrObject.isNew = false;
            ptrObject.lastX = pointer.pointer.x;
            ptrObject.lastY = pointer.pointer.y;
            ptrObject.hasTriggered = false;
        }

        return ptrObject;

    },

    /**
    * Start detection process for gesture, called when a pointer touches the screen
    *
    * @method Phaser.Gesture.SwipeLeft#update 
    * @param {Array} - an array to all the current pointers
    */
    start: function (pointers) {
    
        for (var i = pointers.length - 1; i >=0; --i)
        {
            this._createOrFindPointerData(pointers[i]);
        }

    },
    
    /**
    * Update during the detection of a gesture, called when a pointer moves
    *
    * @method Phaser.Gesture.SwipeLeft#update 
    * @param {Array} - an array to all the current pointers
    * @returns {boolean} True, if the gesture has been detected and can return some tangible information.
    */
    update: function (pointers) {

        for (var i = pointers.length - 1; i >=0; --i)
        {
            var ptrObject = this._createOrFindPointerData(pointers[i]);

            if (ptrObject.pointer.isDown && !ptrObject.hasTriggered)
            {
                var currentX = pointers[i].pointer.x;
                var deltaX = ptrObject.lastX - currentX;

                ptrObject.lastX = currentX;

                if (deltaX > 100)
                {
                    ptrObject.hasTriggered = true;
                    return true;
                }
            }
        }
        
        return false

    },
    
    /**
    * Stop detection process for gesture, called when a pointer leaves the screen
    *
    * @method Phaser.Gesture.SwipeLeft#update 
    * @param {Array} - an array to all the current pointers
    */
    stop: function (pointers) {

        this._pointerData = [];

    },
    
    /**
    * Fetches the current relevant data for this gesture
    *
    * @method Phaser.Gesture.SwipeLeft#getData 
    * @returns {object} an object with data relating to the current state of this gesture
    */
    getData: function () {

        return { didSwipe: true };

    }

}

Phaser.Gesture.SwipeLeft.prototype.constructor = Phaser.Gesture.SwipeLeft;
    
/**
* Swipe-Right detection
*
* @class Phaser.Gesture.SwipeRight
*/
Phaser.Gesture.SwipeRight = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = game;
    
    /**
    * @property {String} - the name of the gesture
    * @default
    */
    this.name = "SwipeRight";
    
    /**
    * @property {Array} _pointerData - A pointer data array.
    * @default
    */
    this._pointerData = [];

};

Phaser.Gesture.SwipeRight.prototype = {

    /** 
    * Find a pointer data object using the helper
    *
    * @method Phaser.Gesture.SwipeRight#_createOrFindPointerData 
    * @private
    * @param {Phaser.Pointer} - the pointer for which we want to retrieve data
    */
    _createOrFindPointerData: function(pointer) {

        var ptrObject = Phaser.Gestures.Helpers.createOrFindPointerData(this._pointerData, pointer);

        if (ptrObject.isNew)
        {
            ptrObject.isNew = false;
            ptrObject.lastX = pointer.pointer.x;
            ptrObject.lastY = pointer.pointer.y;
            ptrObject.hasTriggered = false;
        }

        return ptrObject;

    },

    /**
    * Start detection process for gesture, called when a pointer touches the screen
    *
    * @method Phaser.Gesture.SwipeRight#update 
    * @param {Array} - an array to all the current pointers
    */
    start: function (pointers) {
    
        for (var i = pointers.length - 1; i >=0; --i)
        {
            this._createOrFindPointerData(pointers[i]);
        }

    },
    
    /**
    * Update during the detection of a gesture, called when a pointer moves
    *
    * @method Phaser.Gesture.SwipeRight#update 
    * @param {Array} - an array to all the current pointers
    * @returns {boolean} True, if the gesture has been detected and can return some tangible information.
    */
    update: function (pointers) {

        for (var i = pointers.length - 1; i >=0; --i)
        {
            var ptrObject = this._createOrFindPointerData(pointers[i]);

            if (ptrObject.pointer.isDown && !ptrObject.hasTriggered)
            {
                var currentX = pointers[i].pointer.x;
                var deltaX = ptrObject.lastX - currentX;

                ptrObject.lastX = currentX;

                if (deltaX < -100)
                {
                    ptrObject.hasTriggered = true;
                    return true;
                }
            }
        }
        
        return false

    },
    
    /**
    * Stop detection process for gesture, called when a pointer leaves the screen
    *
    * @method Phaser.Gesture.SwipeRight#update 
    * @param {Array} - an array to all the current pointers
    */
    stop: function (pointers) {

        this._pointerData = [];

    },
    
    /**
    * Fetches the current relevant data for this gesture
    *
    * @method Phaser.Gesture.SwipeRight#getData 
    * @returns {object} an object with data relating to the current state of this gesture
    */
    getData: function () {

        return { didSwipe: true };

    }

}

Phaser.Gesture.SwipeRight.prototype.constructor = Phaser.Gesture.SwipeRight;
    
/**
* Swipe-Down detection
*
* @class Phaser.Gesture.SwipeDown
*/
Phaser.Gesture.SwipeDown = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = game;
    
    /**
    * @property {String} - the name of the gesture
    * @default
    */
    this.name = "SwipeDown";
    
    /**
    * @property {Array} _pointerData - Array of pointer data.
    * @default
    */
    this._pointerData = [];

};

Phaser.Gesture.SwipeDown.prototype = {

    /** 
    * Find a pointer data object using the helper
    *
    * @method Phaser.Gesture.SwipeDown#_createOrFindPointerData 
    * @private
    * @param {Phaser.Pointer} - the pointer for which we want to retrieve data
    */
    _createOrFindPointerData: function (pointer) {

        var ptrObject = Phaser.Gestures.Helpers.createOrFindPointerData(this._pointerData, pointer);

        if (ptrObject.isNew)
        {
            ptrObject.isNew = false;
            ptrObject.lastX = pointer.pointer.x;
            ptrObject.lastY = pointer.pointer.y;
            ptrObject.hasTriggered = false;
        }

        return ptrObject;

    },

    /**
    * Start detection process for gesture, called when a pointer touches the screen
    *
    * @method Phaser.Gesture.SwipeDown#update 
    * @param {Array} - an array to all the current pointers
    */
    start: function (pointers) {
    
        for (var i = pointers.length - 1; i >=0; --i)
        {
            this._createOrFindPointerData(pointers[i]);
        }

    },
    
    /**
    * Update during the detection of a gesture, called when a pointer moves
    *
    * @method Phaser.Gesture.SwipeDown#update 
    * @param {Array} - an array to all the current pointers
    * @returns {boolean} True, if the gesture has been detected and can return some tangible information.
    */
    update: function (pointers) {

        for (var i = pointers.length - 1; i >=0; --i)
        {
            var ptrObject = this._createOrFindPointerData(pointers[i]);

            if (ptrObject.pointer.isDown && !ptrObject.hasTriggered)
            {
                var currentY = pointers[i].pointer.y;
                var deltaY = ptrObject.lastY - currentY;

                ptrObject.lastY = currentY;

                if (deltaY < -100)
                {
                    ptrObject.hasTriggered = true;
                    return true;
                }
            }
        }
        
        return false

    },
    
    /**
    * Stop detection process for gesture, called when a pointer leaves the screen
    *
    * @method Phaser.Gesture.SwipeDown#update 
    * @param {Array} pointers - an array to all the current pointers
    */
    stop: function (pointers) {

        this._pointerData = [];

    },
    
    /**
    * Fetches the current relevant data for this gesture
    *
    * @method Phaser.Gesture.SwipeDown#getData 
    * @returns {object} an object with data relating to the current state of this gesture
    */
    getData: function ( ) {

        return { didSwipe: true };

    }

}

Phaser.Gesture.SwipeDown.prototype.constructor = Phaser.Gesture.SwipeDown;

/**
* Swipe-Up detection
*
* @class Phaser.Gesture.SwipeUp
*/
Phaser.Gesture.SwipeUp = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = game;
    
    /**
    * @property {String} - the name of the gesture
    * @default
    */
    this.name = "SwipeUp";
    
    /**
    * @property {Array} _pointerData - Array of pointer data.
    * @default
    */
    this._pointerData = [];

};

Phaser.Gesture.SwipeUp.prototype = {

    /** 
    * Find a pointer data object using the helper
    *
    * @method Phaser.Gesture.SwipeUp#_createOrFindPointerData 
    * @private
    * @param {Phaser.Pointer} - the pointer for which we want to retrieve data
    */
    _createOrFindPointerData: function (pointer) {

        var ptrObject = Phaser.Gestures.Helpers.createOrFindPointerData(this._pointerData, pointer);

        if (ptrObject.isNew)
        {
            ptrObject.isNew = false;
            ptrObject.lastX = pointer.pointer.x;
            ptrObject.lastY = pointer.pointer.y;
            ptrObject.hasTriggered = false;
        }

        return ptrObject;

    },

    /**
    * Start detection process for gesture, called when a pointer touches the screen
    *
    * @method Phaser.Gesture.SwipeUp#update 
    * @param {Array} - an array to all the current pointers
    */
    start: function (pointers) {
    
        for (var i = pointers.length - 1; i >=0; --i)
        {
            this._createOrFindPointerData(pointers[i]);
        }

    },
    
    /**
    * Update during the detection of a gesture, called when a pointer moves
    *
    * @method Phaser.Gesture.SwipeUp#update 
    * @param {Array} - an array to all the current pointers
    * @returns {boolean} True, if the gesture has been detected and can return some tangible information.
    */
    update: function ( pointers ) {

        for (var i = pointers.length - 1; i >=0; --i)
        {
            var ptrObject = this._createOrFindPointerData(pointers[i]);

            if (ptrObject.pointer.isDown && !ptrObject.hasTriggered)
            {
                var currentY = pointers[i].pointer.y;
                var deltaY = ptrObject.lastY - currentY;

                ptrObject.lastY = currentY;

                if (deltaY > 100)
                {
                    ptrObject.hasTriggered = true;
                    return true;
                }
            }
        }
        
        return false

    },
    
    /**
    * Stop detection process for gesture, called when a pointer leaves the screen
    *
    * @method Phaser.Gesture.SwipeUp#update 
    * @param {Array} - an array to all the current pointers
    */
    stop: function (pointers) {

        this._pointerData = [];

    },
    
    /**
    * Fetches the current relevant data for this gesture
    *
    * @method Phaser.Gesture.SwipeUp#getData 
    * @returns {object} an object with data relating to the current state of this gesture
    */
    getData: function () {

        return { didSwipe: true };

    }

}

Phaser.Gesture.SwipeUp.prototype.constructor = Phaser.Gesture.SwipeUp;
