var Class = require('../../../utils/Class');
var GetValue = require('../../../utils/object/GetValue');

//  var camControl = new CameraControl({
//      camera: this.cameras.main,
//      left: cursors.left,
//      right: cursors.right,
//      speed: float OR { x: 0, y: 0 }
//  })

//  Phaser.Cameras.Scene2D.Controls.KeyControl

var KeyControl = new Class({

    initialize:

    function KeyControl (config)
    {
        this.camera = GetValue(config, 'camera', null);

        this.left = GetValue(config, 'left', null);
        this.right = GetValue(config, 'right', null);
        this.up = GetValue(config, 'up', null);
        this.down = GetValue(config, 'down', null);

        this.zoomIn = GetValue(config, 'zoomIn', null);
        this.zoomOut = GetValue(config, 'zoomOut', null);
        this.zoomSpeed = GetValue(config, 'zoomSpeed', 0.01);

        var speed = GetValue(config, 'speed', null);

        if (typeof speed === 'number')
        {
            this.speedX = speed;
            this.speedY = speed;
        }
        else
        {
            this.speedX = GetValue(config, 'speed.x', 0);
            this.speedY = GetValue(config, 'speed.y', 0);
        }

        this._zoom = 0;

        this.active = (this.camera !== null);
    },

    start: function ()
    {
        this.active = (this.camera !== null);

        return this;
    },

    stop: function ()
    {
        this.active = false;

        return this;
    },

    setCamera: function (camera)
    {
        this.camera = camera;

        return this;
    },

    update: function (delta)
    {
        if (!this.active)
        {
            return;
        }

        if (delta === undefined) { delta = 1; }

        var cam = this.camera;

        if (this.up && this.up.isDown)
        {
            cam.scrollY -= ((this.speedY * delta) | 0);
        }
        else if (this.down && this.down.isDown)
        {
            cam.scrollY += ((this.speedY * delta) | 0);
        }

        if (this.left && this.left.isDown)
        {
            cam.scrollX -= ((this.speedX * delta) | 0);
        }
        else if (this.right && this.right.isDown)
        {
            cam.scrollX += ((this.speedX * delta) | 0);
        }

        //  Camera zoom

        if (this.zoomIn && this.zoomIn.isDown)
        {
            cam.zoom -= this.zoomSpeed;

            if (cam.zoom < 0.1)
            {
                cam.zoom = 0.1;
            }
        }
        else if (this.zoomOut && this.zoomOut.isDown)
        {
            cam.zoom += this.zoomSpeed;
        }
    },

    destroy: function ()
    {
        this.camera = null;

        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;

        this.zoomIn = null;
        this.zoomOut = null;
    }

});

module.exports = KeyControl;
