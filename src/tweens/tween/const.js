var TWEEN_CONST = {

    //  TweenData:

    CREATED: 0,
    INIT: 1,
    DELAY: 2,
    OFFSET_DELAY: 3,
    PENDING_RENDER: 4,
    PLAYING_FORWARD: 5,
    PLAYING_BACKWARD: 6,
    HOLD_DELAY: 7,
    REPEAT_DELAY: 8,
    COMPLETE: 9,

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
