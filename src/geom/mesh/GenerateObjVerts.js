/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Face = require('./Face');
var Vertex = require('./Vertex');

/**
 * This method will return an object containing Face and Vertex instances, generated
 * from the parsed triangulated OBJ Model data given to this function.
 *
 * The obj data should have been parsed in advance via the ParseObj function:
 *
 * ```javascript
 * var data = Phaser.Geom.Mesh.ParseObj(rawData, flipUV);
 *
 * var results = GenerateObjVerts(data);
 * ```
 *
 * Alternatively, you can parse obj files loaded via the OBJFile loader:
 *
 * ```javascript
 * preload ()
 * {
 *   this.load.obj('alien', 'assets/3d/alien.obj);
 * }
 *
 * var results = GenerateObjVerts(this.cache.obj.get('alien));
 * ```
 *
 * Make sure your 3D package has triangulated the model data prior to exporting it.
 *
 * You can use the data returned by this function to populate the vertices of a Mesh Game Object.
 *
 * You may add multiple models to a single Mesh, although they will act as one when
 * moved or rotated. You can scale the model data, should it be too small (or large) to visualize.
 * You can also offset the model via the `x`, `y` and `z` parameters.
 *
 * @function Phaser.Geom.Mesh.GenerateObjVerts
 * @since 3.50.0
 *
 * @param {Phaser.Types.Geom.Mesh.OBJData} data - The parsed OBJ model data.
 * @param {Phaser.GameObjects.Mesh} [mesh] - An optional Mesh Game Object. If given, the generated Faces will be automatically added to this Mesh. Set to `null` to skip.
 * @param {number} [scale=1] - An amount to scale the model data by. Use this if the model has exported too small, or large, to see.
 * @param {number} [x=0] - Offset the model x position by this amount.
 * @param {number} [y=0] - Offset the model y position by this amount.
 * @param {number} [z=0] - Offset the model z position by this amount.
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateVertsResult} The parsed Face and Vertex objects.
 */
var GenerateObjVerts = function (data, mesh, scale, x, y, z)
{
    if (scale === undefined) { scale = 1; }
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (z === undefined) { z = 0; }

    var result = {
        faces: [],
        verts: []
    };

    var materials = data.materials;

    for (var m = 0; m < data.models.length; m++)
    {
        var model = data.models[m];

        var vertices = model.vertices;
        var textureCoords = model.textureCoords;
        var faces = model.faces;

        for (var i = 0; i < faces.length; i++)
        {
            var face = faces[i];

            var v1 = face.vertices[0];
            var v2 = face.vertices[1];
            var v3 = face.vertices[2];

            var m1 = vertices[v1.vertexIndex];
            var m2 = vertices[v2.vertexIndex];
            var m3 = vertices[v3.vertexIndex];

            var t1 = v1.textureCoordsIndex;
            var t2 = v2.textureCoordsIndex;
            var t3 = v3.textureCoordsIndex;

            var uv1 = (t1 === -1) ? { u: 0, v: 1 } : textureCoords[t1];
            var uv2 = (t2 === -1) ? { u: 0, v: 0 } : textureCoords[t2];
            var uv3 = (t3 === -1) ? { u: 1, v: 1 } : textureCoords[t3];

            var color = 0xffffff;

            if (face.material !== '' && materials[face.material])
            {
                color = materials[face.material];
            }

            var vert1 = new Vertex(x + m1.x * scale, y + m1.y * scale, z + m1.z * scale, uv1.u, uv1.v, color);
            var vert2 = new Vertex(x + m2.x * scale, y + m2.y * scale, z + m2.z * scale, uv2.u, uv2.v, color);
            var vert3 = new Vertex(x + m3.x * scale, y + m3.y * scale, z + m3.z * scale, uv3.u, uv3.v, color);

            result.verts.push(vert1, vert2, vert3);
            result.faces.push(new Face(vert1, vert2, vert3));
        }
    }

    if (mesh)
    {
        mesh.faces = mesh.faces.concat(result.faces);
        mesh.vertices = mesh.vertices.concat(result.verts);
    }

    return result;
};

module.exports = GenerateObjVerts;
