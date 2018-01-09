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

        this.size = new Vector2(this.gameObject.width, this.gameObject.height);

        this.scale = new Vector2(1, 1);

        this.adjustScaleX = true;
        this.adjustScaleY = true;

        this._visible = true;
    },

    project: function (camera)
    {
        var pos = this.position;

        var gameObject = this.gameObject;

        camera.project(pos, gameObject);

        camera.getPointSize(pos, this.size, this.scale);

        if (this.scale.x <= 0 || this.scale.y <= 0)
        {
            gameObject.setVisible(false);
        }
        else
        {
            if (!gameObject.visible)
            {
                gameObject.setVisible(true);
            }

            if (this.adjustScaleX)
            {
                gameObject.scaleX = this.scale.x;
            }

            if (this.adjustScaleY)
            {
                gameObject.scaleY = this.scale.y;
            }

            gameObject.setDepth(gameObject.z * -1);
        }
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
    },

    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
        }

    }

});

module.exports = Sprite3D;
