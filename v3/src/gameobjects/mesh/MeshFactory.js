
var Mesh = require('./Mesh');
var BuildFromConfig = require('./BuildFromConfig');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var MeshFactory = {

    KEY: 'mesh',

    add: function (x, y, vertices, uv, key, frame)
    {
        return this.children.add(new Mesh(this.state, x, y, vertices, uv, key, frame));
    },

    make: function (config)
    {
        return BuildFromConfig(this.state, config);
    }

};

module.exports = FactoryContainer.register(MeshFactory);
