var TWEEN_CONST = {

    //  TweenData:

    CREATED: 0,
    INIT: 1,
    DELAY: 2,
    PENDING_RENDER: 3,
    PLAYING_FORWARD: 4,
    PLAYING_BACKWARD: 5,
    HOLD_DELAY: 6,
    REPEAT_DELAY: 7,
    COMPLETE: 8,

    //  Tween specific (starts from 20 to cleanly allow extra TweenData consts in the future)

    PENDING_ADD: 20,
    PAUSED: 21,
    START_DELAY: 22,
    LOOP_DELAY: 23,
    ACTIVE: 24,
    COMPLETE_DELAY: 25,
    PENDING_REMOVE: 26,
    REMOVED: 27

};

module.exports = TWEEN_CONST;
