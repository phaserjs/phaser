var Mesh = require('./Mesh');

var MeshFactory = function (scene, x, y, vertices, uv, key, frame)
{
    return new Mesh(scene, x, y, vertices, uv, key, frame);
};

module.exports = MeshFactory;
