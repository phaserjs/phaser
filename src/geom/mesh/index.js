/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Geom.Mesh
 */

var Mesh = {

    Face: require('./Face'),
    GenerateGridVerts: require('./GenerateGridVerts'),
    GenerateObjVerts: require('./GenerateObjVerts'),
    GenerateVerts: require('./GenerateVerts'),
    ParseObj: require('./ParseObj'),
    ParseObjMaterial: require('./ParseObjMaterial'),
    RotateFace: require('./RotateFace'),
    Vertex: require('./Vertex')

};

module.exports = Mesh;
