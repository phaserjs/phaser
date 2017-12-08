var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var PointerLockChangeEvent = new Class({

    Extends: Event,

    initialize:

    function PointerLockChangeEvent (nativeEvent, isPointerLocked)
    {
        Event.call(this, 'POINTER_LOCK_CHANGE_EVENT');

        this.data = nativeEvent;
        this.isPointerLocked = isPointerLocked;
    }

});

module.exports = PointerLockChangeEvent;
