//  Phaser.Input.Events

module.exports = {

    DRAG: require('./DragEvent'),
    DRAG_END: require('./DragEndEvent'),
    DRAG_ENTER: require('./DragEnterEvent'),
    DRAG_LEAVE: require('./DragLeaveEvent'),
    DRAG_OVER: require('./DragOverEvent'),
    DRAG_START: require('./DragStartEvent'),
    DROP: require('./DropEvent'),

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
