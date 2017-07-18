//  Phaser.Input.InteractiveObject

var InteractiveObject = function (gameObject, hitArea, hitAreaCallback)
{
    return {
        gameObject: gameObject,

        hitArea: hitArea,
        hitAreaCallback: hitAreaCallback,

        localX: 0,
        localY: 0,

        isOver: false,
        isDown: false,

        isDragged: false
    };
};

module.exports = InteractiveObject;
