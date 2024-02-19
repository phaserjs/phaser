/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var flip = true;

var defaultModelName = 'untitled';
var currentGroup = '';
var currentMaterial = '';

/**
 * @ignore
 */
function stripComments (line)
{
    var idx = line.indexOf('#');

    return (idx > -1) ? line.substring(0, idx) : line;
}

/**
 * @ignore
 */
function currentModel (result)
{
    if (result.models.length === 0)
    {
        result.models.push({
            faces: [],
            name: defaultModelName,
            textureCoords: [],
            vertexNormals: [],
            vertices: []
        });
    }

    currentGroup = '';

    return result.models[result.models.length - 1];
}

/**
 * @ignore
 */
function parseObject (lineItems, result)
{
    var modelName = lineItems.length >= 2 ? lineItems[1] : defaultModelName;

    result.models.push({
        faces: [],
        name: modelName,
        textureCoords: [],
        vertexNormals: [],
        vertices: []
    });

    currentGroup = '';
}

/**
 * @ignore
 */
function parseGroup (lineItems)
{
    if (lineItems.length === 2)
    {
        currentGroup = lineItems[1];
    }
}

/**
 * @ignore
 */
function parseVertexCoords (lineItems, result)
{
    var len = lineItems.length;

    var x = (len >= 2) ? parseFloat(lineItems[1]) : 0;
    var y = (len >= 3) ? parseFloat(lineItems[2]) : 0;
    var z = (len >= 4) ? parseFloat(lineItems[3]) : 0;

    currentModel(result).vertices.push({ x: x, y: y, z: z });
}

/**
 * @ignore
 */
function parseTextureCoords (lineItems, result)
{
    var len = lineItems.length;

    var u = (len >= 2) ? parseFloat(lineItems[1]) : 0;
    var v = (len >= 3) ? parseFloat(lineItems[2]) : 0;
    var w = (len >= 4) ? parseFloat(lineItems[3]) : 0;

    if (isNaN(u))
    {
        u = 0;
    }

    if (isNaN(v))
    {
        v = 0;
    }

    if (isNaN(w))
    {
        w = 0;
    }

    if (flip)
    {
        v = 1 - v;
    }

    currentModel(result).textureCoords.push({ u: u, v: v, w: w });
}

/**
 * @ignore
 */
function parseVertexNormal (lineItems, result)
{
    var len = lineItems.length;

    var x = (len >= 2) ? parseFloat(lineItems[1]) : 0;
    var y = (len >= 3) ? parseFloat(lineItems[2]) : 0;
    var z = (len >= 4) ? parseFloat(lineItems[3]) : 0;

    currentModel(result).vertexNormals.push({ x: x, y: y, z: z });
}

/**
 * @ignore
 */
function parsePolygon (lineItems, result)
{
    var totalVertices = lineItems.length - 1;

    if (totalVertices < 3)
    {
        return;
    }

    var face = {
        group: currentGroup,
        material: currentMaterial,
        vertices: []
    };

    for (var i = 0; i < totalVertices; i++)
    {
        var vertexString = lineItems[i + 1];
        var vertexValues = vertexString.split('/');
        var vvLen = vertexValues.length;

        if (vvLen < 1 || vvLen > 3)
        {
            continue;
        }

        var vertexIndex = 0;
        var textureCoordsIndex = 0;
        var vertexNormalIndex = 0;

        vertexIndex = parseInt(vertexValues[0], 10);

        if (vvLen > 1 && vertexValues[1] !== '')
        {
            textureCoordsIndex = parseInt(vertexValues[1], 10);
        }

        if (vvLen > 2)
        {
            vertexNormalIndex = parseInt(vertexValues[2], 10);
        }

        if (vertexIndex !== 0)
        {
            // Negative vertex indices refer to the nth last defined vertex
            // convert these to postive indices for simplicity
            if (vertexIndex < 0)
            {
                vertexIndex = currentModel(result).vertices.length + 1 + vertexIndex;
            }

            textureCoordsIndex -= 1;
            vertexIndex -= 1;
            vertexNormalIndex -= 1;

            face.vertices.push({
                textureCoordsIndex: textureCoordsIndex,
                vertexIndex: vertexIndex,
                vertexNormalIndex: vertexNormalIndex
            });
        }
    }

    currentModel(result).faces.push(face);
}

/**
 * @ignore
 */
function parseMtlLib (lineItems, result)
{
    if (lineItems.length >= 2)
    {
        result.materialLibraries.push(lineItems[1]);
    }
}

/**
 * @ignore
 */
function parseUseMtl (lineItems)
{
    if (lineItems.length >= 2)
    {
        currentMaterial = lineItems[1];
    }
}

/**
 * Parses a Wavefront OBJ File, extracting the models from it and returning them in an array.
 *
 * The model data *must* be triangulated for a Mesh Game Object to be able to render it.
 *
 * @function Phaser.Geom.Mesh.ParseObj
 * @since 3.50.0
 *
 * @param {string} data - The OBJ File data as a raw string.
 * @param {boolean} [flipUV=true] - Flip the UV coordinates?
 *
 * @return {Phaser.Types.Geom.Mesh.OBJData} The parsed model and material data.
 */
var ParseObj = function (data, flipUV)
{
    if (flipUV === undefined) { flipUV = true; }

    flip = flipUV;

    //  Store results in here
    var result = {
        materials: {},
        materialLibraries: [],
        models: []
    };

    currentGroup = '';
    currentMaterial = '';

    var lines = data.split('\n');

    for (var i = 0; i < lines.length; i++)
    {
        var line = stripComments(lines[i]);

        var lineItems = line.replace(/\s\s+/g, ' ').trim().split(' ');

        switch (lineItems[0].toLowerCase())
        {
            case 'o':
                // Start A New Model
                parseObject(lineItems, result);
                break;

            case 'g':
                // Start a new polygon group
                parseGroup(lineItems);
                break;

            case 'v':
                // Define a vertex for the current model
                parseVertexCoords(lineItems, result);
                break;

            case 'vt':
                // Texture Coords
                parseTextureCoords(lineItems, result);
                break;

            case 'vn':
                // Define a vertex normal for the current model
                parseVertexNormal(lineItems, result);
                break;

            case 'f':
                // Define a Face/Polygon
                parsePolygon(lineItems, result);
                break;

            case 'mtllib':
                // Reference to a material library file (.mtl)
                parseMtlLib(lineItems, result);
                break;

            case 'usemtl':
                // Sets the current material to be applied to polygons defined from this point forward
                parseUseMtl(lineItems);
                break;
        }
    }

    return result;
};

module.exports = ParseObj;
