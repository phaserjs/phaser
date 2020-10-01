var ShaderChunk = require('../ShaderChunk');

var Basic = {

    frag: [

        ShaderChunk.commonFrag,
        ShaderChunk.uvParsFrag,
        ShaderChunk.colorParsFrag,
        ShaderChunk.diffuseMapParsFrag,
        ShaderChunk.alphamapParsFrag,
        ShaderChunk.envMapParsFrag,
        ShaderChunk.aoMapParsFrag,
        ShaderChunk.fogParsFrag,

        ShaderChunk.main,

        ShaderChunk.beginFrag,
        ShaderChunk.colorFrag,
        ShaderChunk.diffuseMapFrag,
        ShaderChunk.alphamapFrag,
        ShaderChunk.alphaTestFrag,
        ShaderChunk.envMapFrag,
        ShaderChunk.endFrag,
        ShaderChunk.encodingsFrag,
        ShaderChunk.premultipliedAlphaFrag,
        ShaderChunk.fogFrag

    ],

    vert: [

        ShaderChunk.commonVert,
        ShaderChunk.uvParsVert,
        ShaderChunk.colorParsVert,
        ShaderChunk.envMapParsVert,
        ShaderChunk.morphtargetParsVert,
        ShaderChunk.skinningParsVert,

        ShaderChunk.main,

        ShaderChunk.beginVert,
        ShaderChunk.morphtargetVert,
        ShaderChunk.skinningVert,
        ShaderChunk.pvmVert,
        ShaderChunk.uvVert,
        ShaderChunk.colorVert,
        ShaderChunk.envMapVert

    ]

};

module.exports = Basic;
