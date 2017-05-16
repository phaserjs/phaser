
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var MeshRender = require('./MeshRender');

var Mesh = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.RenderTarget,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        MeshRender
    ],

    initialize:

    function Mesh (state, x, y, vertices, uv, texture, frame)
    {
        GameObject.call(this, state, 'Mesh');

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();

        this.vertices = vertices;
        this.uv = uv;
    }

});

module.exports = Mesh;
