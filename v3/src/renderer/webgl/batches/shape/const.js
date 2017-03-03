var FragmentShader = require('./FragmentShader');
var VertexShader = require('./VertexShader');

var CONST = {

    VERTEX_SIZE: 36,

    // How many 32-bit components does the vertex have.
    SHAPE_VERTEX_COMPONENT_COUNT: 9,

    // Can't be bigger than 10,000 since index are 16-bit
    MAX_VERTICES: 10,

    VERTEX_SHADER_SOURCE: VertexShader,
    FRAGMENT_SHADER_SOURCE: FragmentShader

};

module.exports = CONST;
