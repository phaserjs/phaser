/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Based on code from https://github.com/WesUnwin/obj-file-parser

var Vector3 = require('../../math/Vector3');

var models = [];
var materialLibraries = [];
var vertices = [ null ];
var textureCoords = [ null ];
var vertexNormals = [ null ];
var currentModel;
var currentMaterial = '';
var currentGroup = '';
var smoothingGroup = 0;
var maxVertices = 0;

function addModel (name)
{
    //  Inject empty vec3 because face vertice indexes are 1 based and the array is zero based
    currentModel = {
        name: name,
        faces: []
    };

    models.push(currentModel);

    currentGroup = '';
    smoothingGroup = 0;
}

function getCurrentModel ()
{
    if (models.length === 0)
    {
        addModel('model0');
    }

    return currentModel;
}

function parseObject (lineItems)
{
    var modelName = (lineItems.length >= 2) ? lineItems[1] : 'model' + models.length;

    addModel(modelName);
}

function parseGroup (lineItems)
{
    if (lineItems.length === 2)
    {
        currentGroup = lineItems[1];
    }
}

function parseSmoothShadingStatement (lineItems)
{
    if (lineItems.length === 2)
    {
        smoothingGroup = (lineItems[1].toLowerCase() === 'off') ? 0 : parseInt(lineItems[1]);
    }
}

function parseMtlLib (lineItems)
{
    if (lineItems.length >= 2)
    {
        materialLibraries.push(lineItems[1]);
    }
}

function parseUseMtl (lineItems)
{
    if (lineItems.length >= 2)
    {
        currentMaterial = lineItems[1];
    }
}

function parseVertexCoords (lineItems)
{
    var x = (lineItems.length >= 2) ? parseFloat(lineItems[1]) : 0;
    var y = (lineItems.length >= 3) ? parseFloat(lineItems[2]) : 0;
    var z = (lineItems.length >= 4) ? parseFloat(lineItems[3]) : 0;

    vertices.push(new Vector3(x, y, z));
}

function parseTextureCoords (lineItems)
{
    var u = (lineItems.length >= 2) ? parseFloat(lineItems[1]) : 0;
    var v = (lineItems.length >= 3) ? parseFloat(lineItems[2]) : 0;
    var w = (lineItems.length >= 4) ? parseFloat(lineItems[3]) : 0;

    textureCoords.push({ u: u, v: v, w: w });
}

function parseVertexNormal (lineItems)
{
    var x = (lineItems.length >= 2) ? parseFloat(lineItems[1]) : 0;
    var y = (lineItems.length >= 3) ? parseFloat(lineItems[2]) : 0;
    var z = (lineItems.length >= 4) ? parseFloat(lineItems[3]) : 0;

    vertexNormals.push(new Vector3(x, y, z));
}

function parsePolygon (lineItems)
{
    var totalVertices = (lineItems.length - 1);

    if (totalVertices < 3)
    {
        return;
    }

    if (totalVertices > maxVertices)
    {
        maxVertices = totalVertices;
    }

    //  0 = tri
    //  1 = quad / poly
    var type = (totalVertices > 3) ? 1 : 0;

    var face = {
        material: currentMaterial,
        group: currentGroup,
        smoothingGroup: smoothingGroup,
        type: type,
        vertices: []
    };

    for (var i = 0; i < totalVertices; i++)
    {
        var vertexString = lineItems[i + 1];

        //  Are the values split by a forward-slash (Wavefront style) or a space (Blender style) ?

        var vertexValues;

        var index = vertexString.indexOf('/');

        if (index > -1)
        {
            vertexValues = vertexString.split('/');
        }
        else
        {
            vertexValues = vertexString.split(' ');
        }

        if (vertexValues.length < 1 || vertexValues.length > 3)
        {
            //  Too many values (separated by /) for a single vertex
            return;
        }

        //  Vertex Indicies:
        // f v1 v2 v3 ....

        //  Vertex Texture Coordinate Indices
        // f v1/vt1 v2/vt2 v3/vt3 ...

        // Vertex Normal Indices
        // f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3 ...

        // Vertex Normal Indices Without Texture Coordinate Indices
        // f v1//vn1 v2//vn2 v3//vn3 ...

        var vertexIndex = parseInt(vertexValues[0]);
        var textureCoordsIndex = 0;
        var vertexNormalIndex = 0;

        if (vertexValues.length > 1 && (!vertexValues[1] === ''))
        {
            textureCoordsIndex = parseInt(vertexValues[1]);
        }

        if (vertexValues.length > 2)
        {
            vertexNormalIndex = parseInt(vertexValues[2]);
        }

        if (vertexIndex === 0)
        {
            //  Faces uses invalid vertex index of 0
            return;
        }

        //  Negative vertex indices refer to the nth last defined vertex
        //  convert these to postive indices for simplicity
        if (vertexIndex < 0)
        {
            vertexIndex = getCurrentModel().vertices.length + 1 + vertexIndex;
        }

        face.vertices.push({
            vertexIndex: vertexIndex,
            textureCoordsIndex: textureCoordsIndex,
            vertexNormalIndex: vertexNormalIndex
        });
    }

    getCurrentModel().faces.push(face);
}

function stripComments (line)
{
    var index = line.indexOf('#');

    if (index > -1)
    {
        return line.substring(0, index);
    }

    return line;
}

function reset ()
{
    models = [];
    materialLibraries = [];
    vertices = [ null ];
    textureCoords = [ null ];
    vertexNormals = [ null ];
    currentModel;
    currentMaterial = '';
    currentGroup = '';
    smoothingGroup = 0;
    maxVertices = 0;
}

var ParseOBJ = function (data)
{
    reset();

    var lines = data.split('\n');

    for (var i = 0; i < lines.length; i++)
    {
        var line = stripComments(lines[i]);

        var lineItems = line.replace(/\s\s+/g, ' ').trim().split(' ');

        switch (lineItems[0].toLowerCase())
        {
            case 'o':
                // Start a New Model
                parseObject(lineItems);
                break;

            case 'g':
                // Start a new polygon group
                parseGroup(lineItems);
                break;

            case 'v':
                // Define a vertex for the current model
                parseVertexCoords(lineItems);
                break;

            case 'vt':
                // Texture Coords
                parseTextureCoords(lineItems);
                break;

            case 'vn':
                // Define a vertex normal for the current model
                parseVertexNormal(lineItems);
                break;

            case 's':
                // Smooth shading statement
                parseSmoothShadingStatement(lineItems);
                break;

            case 'f':
                // Define a Face/Polygon
                parsePolygon(lineItems);
                break;

            case 'mtllib':
                // Reference to a material library file (.mtl)
                parseMtlLib(lineItems);
                break;

            case 'usemtl':
                // Sets the current material to be applied to polygons defined from this point forward
                parseUseMtl(lineItems);
                break;
        }
    }

    return {
        vertices: vertices,
        textureCoords: textureCoords,
        vertexNormals: vertexNormals,
        models: models,
        materialLibraries: materialLibraries,
        maxVertices: maxVertices
    };
};

module.exports = ParseOBJ;
