
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../components');
var MeshRender = require('./MeshRender');

var Mesh = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        MeshRender
    ],

    initialize:

    function Mesh (scene, x, y, vertices, uv, colors, alphas, texture, frame)
    {
        GameObject.call(this, scene, 'Mesh');

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOrigin();
        this.initPipeline('TextureTintPipeline');

        if (vertices.length !== uv.length)
        {
            throw new Error('Phaser: Vertex count must match UV count');
        }

        var verticesUB = (vertices.length / 2) | 0;

        if (colors.length > 0 && colors.length < verticesUB)
        {
            throw new Error('Phaser: Color count must match Vertex count');
        }

        if (alphas.length > 0 && alphas.length < verticesUB)
        {
            throw new Error('Phaser: Alpha count must match Vertex count');
        }

        var i;

        if (colors.length === 0)
        {
            for (i = 0; i < verticesUB; ++i)
            {
                colors[i] = 0xFFFFFF;
            }
        }

        if (alphas.length === 0)
        {
            for (i = 0; i < verticesUB; ++i)
            {
                alphas[i] = 1.0;
            }
        }

        this.vertices = new Float32Array(vertices);
        this.uv = new Float32Array(uv);
        this.colors = new Uint32Array(colors);
        this.alphas = new Float32Array(alphas);
    }

});

module.exports = Mesh;
