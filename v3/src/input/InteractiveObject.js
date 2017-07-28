var NOOP = require('../utils/NOOP');

//  Phaser.Input.InteractiveObject

var InteractiveObject = function (gameObject, hitArea, hitAreaCallback)
{
    return {

        gameObject: gameObject,

        enabled: true,
        draggable: false,
        dropZone: false,

        target: null,

        camera: null,

        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,

        localX: 0,
        localY: 0,

        //  0 = Not being dragged
        //  1 = Being checked for dragging
        //  2 = Being dragged
        dragState: 0,

        dragStartX: 0,
        dragStartY: 0,

        dragX: 0,
        dragY: 0,

        //  Callbacks

        callbackContext: gameObject,

        //  gameObject, pointer, x, y
        onUp: NOOP,

        //  gameObject, pointer, x, y
        onDown: NOOP,

        //  gameObject, pointer, x, y
        onOver: NOOP,

        //  gameObject, pointer
        onOut: NOOP,

        //  gameObject, pointer, x, y
        onMove: NOOP,

        onDragStart: NOOP,
        onDrag: NOOP,
        onDragEnd: NOOP

    };
};

module.exports = InteractiveObject;
