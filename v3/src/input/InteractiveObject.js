var NOOP = require('../utils/NOOP');

//  Phaser.Input.InteractiveObject

var InteractiveObject = function (gameObject, hitArea, hitAreaCallback)
{
    return {
        gameObject: gameObject,

        enabled: true,
        draggable: false,

        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,

        localX: 0,
        localY: 0,

        isOver: false,
        isDown: false,
        isDragged: false,

        pointersOver: [],
        pointersDown: [],

        callbackContext: gameObject,

        onDown: NOOP,
        onUp: NOOP,
        onOver: NOOP,
        onOut: NOOP,

        dragX: 0,
        dragY: 0,

        onDragStart: NOOP,
        onDrag: NOOP,
        onDragEnd: NOOP
    };
};

module.exports = InteractiveObject;
