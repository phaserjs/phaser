var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Sprite = require('../sprite/Sprite');
var Vector2 = require('../../math/Vector2');
var Vector4 = require('../../math/Vector4');

var Sprite3D = new Class({

    Extends: GameObject,

    initialize:

    function Sprite3D (scene, x, y, z, texture, frame)
    {
        GameObject.call(this, scene, 'Sprite3D');

        this.gameObject = new Sprite(scene, 0, 0, texture, frame);

        this.position = new Vector4(x, y, z);

        this.size = new Vector2(1, 1);

        this.adjustScaleX = true;
        this.adjustScaleY = true;

        this._visible = true;
    },

    project: function (camera)
    {
        var pos = this.position;
        var gameObject = this.gameObject;

        camera.project(pos, gameObject);

        var scale = camera.getPointSize(pos, this.size);

        if (this.adjustScaleX)
        {
            gameObject.scaleX = scale.x;
        }

        if (this.adjustScaleY)
        {
            gameObject.scaleY = scale.y;
        }

        gameObject.setDepth(gameObject.z);

        gameObject.setVisible((pos.z > camera.z));
    },

    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            this._visible = value;
            this.gameObject.visible = value;
        }

    },

    setVisible: function (value)
    {
        this.visible = value;

        return this;
    }

});

module.exports = Sprite3D;
