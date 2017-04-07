var CONST = {

    // VERTEX_SIZE = (sizeof(vec2) * 4) + (sizeof(float) + sizeof(uint32))
    VERTEX_SIZE: 24,
    INDEX_SIZE: 2,
    QUAD_VERTEX_COUNT: 4,
    QUAD_INDEX_COUNT: 6,

    // How many 32-bit components does the vertex have.
    QUAD_VERTEX_COMPONENT_COUNT: 6,

    // Can't be bigger since index are 16-bit
    MAX_QUADS: 2
    
};

module.exports = CONST;
