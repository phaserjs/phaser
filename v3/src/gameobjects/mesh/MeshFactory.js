var Mesh = require('./Mesh');

var MeshFactory = function (state, x, y, vertices, uv, key, frame)
{
    return new Mesh(state, x, y, vertices, uv, key, frame);
};

module.exports = MeshFactory;
