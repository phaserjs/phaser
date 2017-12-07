var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');
var Vector3 = require('../../math/Vector3');

//  Phaser.Loader.FileTypes.WavefrontFile

var WavefrontFile = new Class({

    Extends: File,

    initialize:

    function WavefrontFile (key, url, path, xhrSettings)
    {
        var fileKey = (typeof key === 'string') ? key : GetFastValue(key, 'key', '');

        var fileConfig = {
            type: 'obj',
            extension: GetFastValue(key, 'extension', 'obj'),
            responseType: 'text',
            key: fileKey,
            url: GetFastValue(key, 'file', url),
            path: path,
            xhrSettings: GetFastValue(key, 'xhr', xhrSettings)
        };

        File.call(this, fileConfig);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        var text = this.xhrLoader.responseText;

        var verts = [];
        var faces = [];

        // split the text into lines
        var lines = text.replace('\r', '').split('\n');
        var count = lines.length;
        var tokens;
        var i;
        var face;

        for (i = 0; i < count; i++)
        {
            var line = lines[i];

            if (line[0] === 'v')
            {
                // lines that start with 'v' are vertices
                tokens = line.split(' ');

                var pos = new Vector3(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
                var normal = new Vector3();

                if (tokens.length > 4)
                {
                    normal.x = parseFloat(tokens[5]);
                    normal.y = parseFloat(tokens[6]);
                    normal.z = parseFloat(tokens[7]);
                }

                verts.push({
                    pos: pos,
                    normal: normal
                });
            }
            else if (line[0] === 'f')
            {
                // lines that start with 'f' are faces
                tokens = line.split(' ');

                face = {
                    A: parseInt(tokens[1], 10),
                    B: parseInt(tokens[2], 10),
                    C: parseInt(tokens[3], 10),
                    D: parseInt(tokens[4], 10)
                };
            
                if (face.A < 0)
                {
                    face.A = verts.length + face.A;
                }
                else
                {
                    face.A--;
                }

                if (face.B < 0)
                {
                    face.B = verts.length + face.B;
                }
                else
                {
                    face.B--;
                }

                if (face.C < 0)
                {
                    face.C = verts.length + face.C;
                }
                else
                {
                    face.C--;
                }

                if (!face.D)
                {
                    face.D = face.C;
                }
                else if (face.D < 0)
                {
                    face.D = verts.length + face.D;
                }
                else
                {
                    face.D--;
                }

                faces.push(face);
            }
        }

        //  Compute normals
        for (i = 0; i < faces.length; i++)
        {
            face = faces[i];

            var vertA = verts[face.A];
            var vertB = verts[face.B];
            var vertC = verts[face.C];

            face.normal = vertA.normal.clone();
            face.normal.add(vertB.normal).add(vertC.normal).scale(1 / 3).normalize();
        }

        this.data = {
            verts: verts,
            faces: faces
        };

        this.onComplete();

        callback(this);
    }

});

WavefrontFile.create = function (loader, key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            loader.addFile(new WavefrontFile(key[i], url, loader.path, xhrSettings));
        }
    }
    else
    {
        loader.addFile(new WavefrontFile(key, url, loader.path, xhrSettings));
    }

    //  For method chaining
    return loader;
};

module.exports = WavefrontFile;
