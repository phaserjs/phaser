/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BufferAttribute = require('./BufferAttribute');
var Class = require('../../utils/Class');
var Geometry = require('./Geometry');

var PlaneGeometry = new Class({

    Extends: Geometry,

    initialize:

    function PlaneGeometry (width, height, widthSegments, heightSegments)
    {
        Geometry.call(this);

        this.build(width, height, widthSegments, heightSegments);
    },

    build: function (width, height, widthSegments, heightSegments)
    {
        width = width || 1;
        height = height || 1;

        var halfWidth = width / 2;
        var halfHeight = height / 2;

        var gridX = Math.floor(widthSegments) || 1;
        var gridY = Math.floor(heightSegments) || 1;

        var gridX1 = gridX + 1;
        var gridY1 = gridY + 1;

        var segmentWidth = width / gridX;
        var segmentHeight = height / gridY;

        var ix, iy;

        // buffers

        var indices = [];
        var vertices = [];
        var normals = [];
        var uvs = [];

        // generate vertices, normals and uvs

        for (iy = 0; iy < gridY1; iy++)
        {
            var y = iy * segmentHeight - halfHeight;

            for (ix = 0; ix < gridX1; ix++)
            {
                var x = ix * segmentWidth - halfWidth;

                vertices.push(x, 0, y);

                normals.push(0, 1, 0);

                uvs.push(ix / gridX);
                uvs.push(1 - (iy / gridY));
            }
        }

        // indices

        for (iy = 0; iy < gridY; iy++)
        {
            for (ix = 0; ix < gridX; ix++)
            {
                var a = ix + gridX1 * iy;
                var b = ix + gridX1 * (iy + 1);
                var c = (ix + 1) + gridX1 * (iy + 1);
                var d = (ix + 1) + gridX1 * iy;

                // faces

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        // build geometry

        this.setIndex(indices);
        this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
        this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
        this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

});

module.exports = PlaneGeometry;
