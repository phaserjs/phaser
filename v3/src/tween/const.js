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
    LOOP_DELAY: 22,
    ACTIVE: 23,
    COMPLETE_DELAY: 24,
    PENDING_REMOVE: 25,
    REMOVED: 26

};

module.exports = TWEEN_CONST;
