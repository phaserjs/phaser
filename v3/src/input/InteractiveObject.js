var NOOP = require('../utils/NOOP');

//  Phaser.Input.InteractiveObject

var InteractiveObject = function (gameObject, hitArea, hitAreaCallback)
{
    return {
        gameObject: gameObject,

        enabled: true,

        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,

        localX: 0,
        localY: 0,

        isOver: false,
        isDown: false,
        isDragged: false,

        callbackContext: gameObject,

        onDown: NOOP,
        onUp: NOOP,
        onOver: NOOP,
        onOut: NOOP
    };
};

module.exports = InteractiveObject;
