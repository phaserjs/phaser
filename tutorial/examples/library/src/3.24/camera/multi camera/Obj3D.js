var Obj3D = new Phaser.Class({

    initialize:

    function Obj3D (camera, modelData, x, y, z)
    {
        this.camera = camera;
        this.model = modelData;

        this.x = x;
        this.y = y;
        this.z = z;

        this.thickness = 2;
        this.color = 0x00ff00;
        this.alpha = 1;

        this.scale = 100;
    },

    rotateX: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        var model = this.model;
        
        for (var n = 0; n < model.verts.length; n++)
        {
            var vert = model.verts[n];
            var y = vert.y;
            var z = vert.z;

            vert.y = y * tc - z * ts;
            vert.z = z * tc + y * ts;
        }
    },

    rotateY: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        var model = this.model;
        
        for (var n = 0; n < model.verts.length; n++)
        {
            var vert = model.verts[n];
            var x = vert.x;
            var z = vert.z;

            vert.x = x * tc - z * ts;
            vert.z = z * tc + x * ts;
        }
    },

    rotateZ: function (theta)
    {
        var ts = Math.sin(theta);
        var tc = Math.cos(theta);
        var model = this.model;
        
        for (var n = 0; n < model.verts.length; n++)
        {
            var vert = model.verts[n];
            var x = vert.x;
            var y = vert.y;

            vert.x = x * tc - y * ts;
            vert.y = y * tc + x * ts;
        }
    },

    render: function (graphics)
    {
        var model = this.model;

        var x = this.camera.x + this.x;
        var y = this.camera.y + this.y;
        var z = this.z;
        var scale = this.scale;

        graphics.lineStyle(this.thickness, this.color, this.alpha);

        graphics.beginPath();

        for (var i = 0; i < model.faces.length; i++)
        {
            var face = model.faces[i];

            var v0 = model.verts[face[0] - 1];
            var v1 = model.verts[face[1] - 1];
            var v2 = model.verts[face[2] - 1];
            var v3 = model.verts[face[3] - 1];

            // if (v0 && v1 && v2 && v3)
            // {
                this.drawLine(graphics, x + v0.x * scale, y - v0.y * scale, x + v1.x * scale, y - v1.y * scale);
                this.drawLine(graphics, x + v1.x * scale, y - v1.y * scale, x + v2.x * scale, y - v2.y * scale);
                this.drawLine(graphics, x + v2.x * scale, y - v2.y * scale, x + v3.x * scale, y - v3.y * scale);
                this.drawLine(graphics, x + v3.x * scale, y - v3.y * scale, x + v0.x * scale, y - v0.y * scale);
            // }
        }

        graphics.closePath();
        graphics.strokePath();
    },

    drawLine: function (graphics, x0, y0, x1, y1)
    {
        graphics.moveTo(x0, y0);
        graphics.lineTo(x1, y1);
    }

});
