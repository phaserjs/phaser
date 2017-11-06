var CONST = {

    // VERTEX_SIZE = (sizeof(vec2) * 2)
    VERTEX_SIZE: 8,
    INDEX_SIZE: 2,
    SPRITE_VERTEX_COUNT: 4,
    SPRITE_INDEX_COUNT: 6,

    // How many 32-bit components does the vertex have.
    SPRITE_VERTEX_COMPONENT_COUNT: 6,

    // Can't be bigger since index are 16-bit
    MAX_SPRITES: 4
    
};

module.exports = CONST;
