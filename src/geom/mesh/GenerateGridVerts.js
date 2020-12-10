/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Face = require('./Face');
var GetFastValue = require('../../utils/object/GetFastValue');
var Matrix4 = require('../../math/Matrix4');
var Vector3 = require('../../math/Vector3');
var Vertex = require('./Vertex');

var tempPosition = new Vector3();
var tempRotation = new Vector3();
var tempMatrix = new Matrix4();

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
 * @function Phaser.Geom.Mesh.GenerateGridVerts
 * @since 3.50.0
 *
 * @param {Phaser.Types.Geom.Mesh.GenerateGridConfig} config - A Grid configuration object.
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateGridVertsResult} A Grid Result object, containing the generated vertices and indicies.
 */
var GenerateGridVerts = function (config)
{
    var mesh = GetFastValue(config, 'mesh');
    var texture = GetFastValue(config, 'texture', null);
    var frame = GetFastValue(config, 'frame');
    var width = GetFastValue(config, 'width', 1);
    var height = GetFastValue(config, 'height', width);
    var widthSegments = GetFastValue(config, 'widthSegments', 1);
    var heightSegments = GetFastValue(config, 'heightSegments', widthSegments);
    var posX = GetFastValue(config, 'x', 0);
    var posY = GetFastValue(config, 'y', 0);
    var posZ = GetFastValue(config, 'z', 0);
    var rotateX = GetFastValue(config, 'rotateX', 0);
    var rotateY = GetFastValue(config, 'rotateY', 0);
    var rotateZ = GetFastValue(config, 'rotateZ', 0);
    var zIsUp = GetFastValue(config, 'zIsUp', true);
    var isOrtho = GetFastValue(config, 'isOrtho', (mesh) ? mesh.dirtyCache[11] : false);
    var colors = GetFastValue(config, 'colors', [ 0xffffff ]);
    var alphas = GetFastValue(config, 'alphas', [ 1 ]);
    var tile = GetFastValue(config, 'tile', false);
    var flipY = GetFastValue(config, 'flipY', false);

    var widthSet = GetFastValue(config, 'width', null);

    var result = {
        faces: [],
        verts: []
    };

    tempPosition.set(posX, posY, posZ);
    tempRotation.set(rotateX, rotateY, rotateZ);
    tempMatrix.fromRotationXYTranslation(tempRotation, tempPosition, zIsUp);

    if (!texture && mesh)
    {
        texture = mesh.texture;
    }
    else if (mesh && typeof(texture) === 'string')
    {
        texture = mesh.scene.sys.textures.get(texture);
    }
    else
    {
        //  There's nothing more we can do without a texture
        return result;
    }

    var textureFrame = texture.get(frame);

    //  If the Mesh is ortho and no width / height is given, we'll default to texture sizes (if set!)
    if (!widthSet && isOrtho && texture && mesh)
    {
        width = textureFrame.width / mesh.height;
        height = textureFrame.height / mesh.height;
    }

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

    var ix;
    var iy;

    var frameU0 = 0;
    var frameU1 = 1;
    var frameV0 = 0;
    var frameV1 = 1;

    if (textureFrame)
    {
        frameU0 = textureFrame.u0;
        frameU1 = textureFrame.u1;

        if (!flipY)
        {
            frameV0 = textureFrame.v0;
            frameV1 = textureFrame.v1;
        }
        else
        {
            frameV0 = textureFrame.v1;
            frameV1 = textureFrame.v0;
        }
    }

    var frameU = frameU1 - frameU0;
    var frameV = frameV1 - frameV0;

    for (iy = 0; iy < gridY1; iy++)
    {
        var y = iy * segmentHeight - halfHeight;

        for (ix = 0; ix < gridX1; ix++)
        {
            var x = ix * segmentWidth - halfWidth;

            vertices.push(x, -y);

            var tu = frameU0 + frameU * (ix / gridX);
            var tv = frameV0 + frameV * (iy / gridY);

            uvs.push(tu, tv);
        }
    }

    if (!Array.isArray(colors))
    {
        colors = [ colors ];
    }

    if (!Array.isArray(alphas))
    {
        alphas = [ alphas ];
    }

    var alphaIndex = 0;
    var colorIndex = 0;

    for (iy = 0; iy < gridY; iy++)
    {
        for (ix = 0; ix < gridX; ix++)
        {
            var a = (ix + gridX1 * iy) * 2;
            var b = (ix + gridX1 * (iy + 1)) * 2;
            var c = ((ix + 1) + gridX1 * (iy + 1)) * 2;
            var d = ((ix + 1) + gridX1 * iy) * 2;

            var color = colors[colorIndex];
            var alpha = alphas[alphaIndex];

            var vert1 = new Vertex(vertices[a], vertices[a + 1], 0, uvs[a], uvs[a + 1], color, alpha).transformMat4(tempMatrix);
            var vert2 = new Vertex(vertices[b], vertices[b + 1], 0, uvs[b], uvs[b + 1], color, alpha).transformMat4(tempMatrix);
            var vert3 = new Vertex(vertices[d], vertices[d + 1], 0, uvs[d], uvs[d + 1], color, alpha).transformMat4(tempMatrix);
            var vert4 = new Vertex(vertices[b], vertices[b + 1], 0, uvs[b], uvs[b + 1], color, alpha).transformMat4(tempMatrix);
            var vert5 = new Vertex(vertices[c], vertices[c + 1], 0, uvs[c], uvs[c + 1], color, alpha).transformMat4(tempMatrix);
            var vert6 = new Vertex(vertices[d], vertices[d + 1], 0, uvs[d], uvs[d + 1], color, alpha).transformMat4(tempMatrix);

            if (tile)
            {
                vert1.setUVs(frameU0, frameV1);
                vert2.setUVs(frameU0, frameV0);
                vert3.setUVs(frameU1, frameV1);
                vert4.setUVs(frameU0, frameV0);
                vert5.setUVs(frameU1, frameV0);
                vert6.setUVs(frameU1, frameV1);
            }

            colorIndex++;

            if (colorIndex === colors.length)
            {
                colorIndex = 0;
            }

            alphaIndex++;

            if (alphaIndex === alphas.length)
            {
                alphaIndex = 0;
            }

            result.verts.push(vert1, vert2, vert3, vert4, vert5, vert6);

            result.faces.push(
                new Face(vert1, vert2, vert3),
                new Face(vert4, vert5, vert6)
            );
        }
    }

    if (mesh)
    {
        mesh.faces = mesh.faces.concat(result.faces);
        mesh.vertices = mesh.vertices.concat(result.verts);
    }

    return result;
};

module.exports = GenerateGridVerts;
