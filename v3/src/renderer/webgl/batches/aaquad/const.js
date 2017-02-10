var FragmentShader = require('./FragmentShader');
var VertexShader = require('./VertexShader');

var CONST = {

    // VERTEX_SIZE = sizeof(vec2) + sizeof(vec4)
    VERTEX_SIZE: 24,
    INDEX_SIZE: 2,
    AAQUAD_VERTEX_COUNT: 4,
    AAQUAD_INDEX_COUNT: 6,

    // How many 32-bit components does the vertex have.
    AAQUAD_VERTEX_COMPONENT_COUNT: 6,
    MAX_AAQUAD: 2000,

    VERTEX_SHADER_SOURCE: VertexShader,
    FRAGMENT_SHADER_SOURCE: FragmentShader

};

module.exports = CONST;
