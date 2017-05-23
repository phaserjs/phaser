
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

    function Mesh (state, x, y, vertices, uv, indices, colors, alphas, texture, frame)
    {
        GameObject.call(this, state, 'Mesh');

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();

        if (vertices.length !== uv.length)
        {
            throw new Error('Phaser: Vertex count must match UV count');
        }

        if (colors.length > 0 && colors.length < (vertices.length / 2)|0)
        {
            throw new Error('Phaser: Color count must match Vertex count');
        }

        if (alphas.length > 0 && alphas.length < (vertices.length / 2)|0)
        {
            throw new Error('Phaser: Alpha count must match Vertex count');
        }

        var i;

        if (colors.length === 0)
        {
            for (i = 0; i < (vertices.length / 2)|0; ++i)
            {
                colors[i] = 0xFFFFFF;
            }
        }

        if (alphas.length === 0)
        {
            for (i = 0; i < (vertices.length / 2)|0; ++i)
            {
                alphas[i] = 1.0;
            }
        }

        this.vertices = new Float32Array(vertices);
        this.uv = new Float32Array(uv);
        this.indices = new Uint16Array(indices);
        this.colors = new Uint32Array(colors);
        this.alphas = new Float32Array(alphas);
    }

});

module.exports = Mesh;
