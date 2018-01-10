var CONST = {

    // VERTEX_SIZE = sizeof(vec2) + sizeof(vec2) + sizeof(float)
    VERTEX_SIZE: 20,
    INDEX_SIZE: 2,
    PARTICLE_VERTEX_COUNT: 4,
    PARTICLE_INDEX_COUNT: 6,

    // How many 32-bit components does the vertex have.
    PARTICLE_VERTEX_COMPONENT_COUNT: 5,

    // Can't be bigger than 10,000 since index are 16-bit
    MAX_PARTICLES: 2000,

};

module.exports = CONST;
