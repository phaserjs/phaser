var NOOP = require('../utils/NOOP');

//  Phaser.Input.InteractiveObject

var InteractiveObject = function (gameObject, hitArea, hitAreaCallback)
{
    return {
        gameObject: gameObject,

        enabled: true,
        // draggable: false,

        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,

        localX: 0, // tempX value populated by HitTest function
        localY: 0, // tempY value populated by HitTest function

        // isOver: false,
        // isDown: false,
        // isDragged: false,

        // checkingDrag: false,

        dragX: 0,
        dragY: 0,

        callbackContext: gameObject,

        onUp: NOOP,
        onDown: NOOP,
        onOver: NOOP,
        onOut: NOOP,
        onMove: NOOP,

        onDragStart: NOOP,
        onDrag: NOOP,
        onDragEnd: NOOP
    };
};

module.exports = InteractiveObject;
