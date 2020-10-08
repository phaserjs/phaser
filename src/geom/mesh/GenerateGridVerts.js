/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * Creates a grid of vertices based on the given configuration object and optionally adds it to a Mesh.
 *
 * The size of the grid is given in pixels. An example configuration may be:
 *
 * `{ width: 256, height: 256, widthSegments: 2, heightSegments: 2, tile: true }`
 *
 * This will create a grid 256 x 256 pixels in size, split into 2 x 2 segments, with
 * the texture tiling across the cells.
 *
 * You can split the grid into segments both vertically and horizontally. This will
 * generate two faces per grid segment as a result.
 *
 * The `tile` parameter allows you to control if the tile will repeat across the grid
 * segments, or be displayed in full.
 *
 * If adding this grid to a Mesh you can offset the grid via the `x` and `y` properties.
 *
 * UV coordinates are generated based on the given texture and frame in the config. For
 * example, no frame is given, the UVs will be in the range 0 to 1. If a frame is given,
 * such as from a texture atlas, the UVs will be generated within the range of that frame.
 *
 * @function Phaser.Geom.Mesh.GeneraterGridVerts
 * @since 3.50.0
 *
 * @param {Phaser.Types.Geom.Mesh.GenerateGridConfig} config - A Grid configuration object.
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateGridVertsResult} A Grid Result object, containing the generated vertices and indicies.
 */
var GenerateGridVerts = function (config)
{
    var texture = GetFastValue(config, 'texture');
    var frame = GetFastValue(config, 'frame');
    var mesh = GetFastValue(config, 'mesh');
    var width = GetFastValue(config, 'width', 128);
    var height = GetFastValue(config, 'height', width);
    var widthSegments = GetFastValue(config, 'widthSegments', 1);
    var heightSegments = GetFastValue(config, 'heightSegments', widthSegments);
    var posX = GetFastValue(config, 'x', 0);
    var posY = GetFastValue(config, 'y', 0);
    var colors = GetFastValue(config, 'colors', 0xffffff);
    var alphas = GetFastValue(config, 'alphas', 1);
    var tile = GetFastValue(config, 'tile', false);

    var halfWidth = width / 2;
    var halfHeight = height / 2;

    var gridX = Math.floor(widthSegments);
    var gridY = Math.floor(heightSegments);

    var gridX1 = gridX + 1;
    var gridY1 = gridY + 1;

    var segmentWidth = width / gridX;
    var segmentHeight = height / gridY;

    var uvs = [];
    var vertices = [];
    var indices = [];

    var ix;
    var iy;

    var textureFrame = texture.get(frame);

    var frameU0 = textureFrame.u0;
    var frameU1 = textureFrame.u1;

    var frameV0 = textureFrame.v0;
    var frameV1 = textureFrame.v1;

    var frameU = frameU1 - frameU0;
    var frameV = frameV1 - frameV0;

    var tv;
    var tu;

    for (iy = 0; iy < gridY1; iy++)
    {
        var y = posY + (iy * segmentHeight - halfHeight);

        for (ix = 0; ix < gridX1; ix++)
        {
            var x = posX + (ix * segmentWidth - halfWidth);

            vertices.push(x, -y);

            if (!tile)
            {
                tu = frameU0 + frameU * (ix / gridX);
                tv = frameV0 + frameV * (1 - (iy / gridY));

                uvs.push(tu, tv);
            }
        }
    }

    var tiledVertices = [];

    for (iy = 0; iy < gridY; iy++)
    {
        for (ix = 0; ix < gridX; ix++)
        {
            var a = ix + gridX1 * iy;
            var b = ix + gridX1 * (iy + 1);
            var c = (ix + 1) + gridX1 * (iy + 1);
            var d = (ix + 1) + gridX1 * iy;

            if (!tile)
            {
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
            else
            {
                a *= 2;
                b *= 2;
                c *= 2;
                d *= 2;

                tiledVertices.push(
                    vertices[a], vertices[a + 1],
                    vertices[b], vertices[b + 1],
                    vertices[d], vertices[d + 1],

                    vertices[b], vertices[b + 1],
                    vertices[c], vertices[c + 1],
                    vertices[d], vertices[d + 1]
                );

                uvs.push(
                    frameU0, frameV1,
                    frameU0, frameV0,
                    frameU1, frameV1,

                    frameU0, frameV0,
                    frameU1, frameV0,
                    frameU1, frameV1
                );
            }
        }
    }

    if (mesh)
    {
        if (tile)
        {
            mesh.addVertices(tiledVertices, uvs, null, colors, alphas);
        }
        else
        {
            mesh.addVertices(vertices, uvs, indices, colors, alphas);
        }
    }

    return {
        verts: (tile) ? tiledVertices : vertices,
        indices: indices,
        uvs: uvs,
        colors: colors,
        alphas: alphas
    };
};

module.exports = GenerateGridVerts;
