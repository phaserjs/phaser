//  Phaser.Input.Events

module.exports = {

    DROP: require('./DropEvent'),
    DRAG: require('./DragEvent'),
    DRAG_END: require('./DragEndEvent'),
    DRAG_START: require('./DragStartEvent'),

    GAME_OBJECT_DOWN: require('./GameObjectDownEvent'),
    GAME_OBJECT_MOVE: require('./GameObjectMoveEvent'),
    GAME_OBJECT_OUT: require('./GameObjectOutEvent'),
    GAME_OBJECT_OVER: require('./GameObjectOverEvent'),
    GAME_OBJECT_UP: require('./GameObjectUpEvent'),

    POINTER_DOWN: require('./PointerDownEvent'),
    POINTER_MOVE: require('./PointerMoveEvent'),
    POINTER_OUT: require('./PointerOutEvent'),
    POINTER_OVER: require('./PointerOverEvent'),
    POINTER_UP: require('./PointerUpEvent')

};
