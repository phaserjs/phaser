var CONST = {

    VERSION: '3.0.0',

    AUTO: 0,
    CANVAS: 1,
    WEBGL: 2,

    IMAGE: 20,

    state: {

        PENDING: 0,
        INSTALLED: 1,

        BOOT: 0,
        INIT: 1,
        PRELOAD: 2,
        CREATE: 3,
        UPDATE: 4,
        RENDER: 5,
        SHUTDOWN: 6

    }

};

module.exports = CONST;
