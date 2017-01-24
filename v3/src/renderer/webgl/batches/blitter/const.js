var FragmentShader = require('./FragmentShader');
var VertexShader = require('./VertexShader');

var CONST = {

    // VERTEX_SIZE = sizeof(vec2) + sizeof(vec2) + sizeof(float)
    VERTEX_SIZE: 20,
    INDEX_SIZE: 2,
    PARTICLE_VERTEX_COUNT: 4,
    PARTICLE_INDEX_COUNT: 6,

    // How many 32-bit components does the vertex have.
    PARTICLE_VERTEX_COMPONENT_COUNT: 5,

    // Can't be bigger since index are 16-bit
    MAX_PARTICLES: 10000,

    VERTEX_SHADER_SOURCE: VertexShader,
    FRAGMENT_SHADER_SOURCE: FragmentShader

};

module.exports = CONST;
