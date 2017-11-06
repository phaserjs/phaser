module.exports = {

    /**
    * A constant used for the sortDirection value.
    * Use this if you don't wish to perform any pre-collision sorting at all, or will manually sort your Groups.
    * @constant
    * @type {number}
    */
    SORT_NONE: 0,

    /**
    * A constant used for the sortDirection value.
    * Use this if your game world is wide but short and scrolls from the left to the right (i.e. Mario)
    * @constant
    * @type {number}
    */
    LEFT_RIGHT: 1,

    /**
    * A constant used for the sortDirection value.
    * Use this if your game world is wide but short and scrolls from the right to the left (i.e. Mario backwards)
    * @constant
    * @type {number}
    */
    RIGHT_LEFT: 2,

    /**
    * A constant used for the sortDirection value.
    * Use this if your game world is narrow but tall and scrolls from the top to the bottom (i.e. Dig Dug)
    * @constant
    * @type {number}
    */
    TOP_BOTTOM: 3,

    /**
    * A constant used for the sortDirection value.
    * Use this if your game world is narrow but tall and scrolls from the bottom to the top (i.e. Commando or a vertically scrolling shoot-em-up)
    * @constant
    * @type {number}
    */
    BOTTOM_TOP: 4

};
