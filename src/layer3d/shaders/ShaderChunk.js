/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var alphamapFrag = require('./chunks/alphamapFrag');
var alphamapParsFrag = require('./chunks/alphamapParsFrag');
var alphaTestFrag = require('./chunks/alphaTestFrag');
var ambientlightParsFrag = require('./chunks/ambientlightParsFrag');
var aoMapParsFrag = require('./chunks/aoMapParsFrag');
var beginFrag = require('./chunks/beginFrag');
var beginVert = require('./chunks/beginVert');
var bsdfs = require('./chunks/bsdfs');
var bumpMapParsFrag = require('./chunks/bumpMapParsFrag');
var clippingPlanesFrag = require('./chunks/clippingPlanesFrag');
var clippingPlanesParsFrag = require('./chunks/clippingPlanesParsFrag');
var colorFrag = require('./chunks/colorFrag');
var colorParsFrag = require('./chunks/colorParsFrag');
var colorParsVert = require('./chunks/colorParsVert');
var colorVert = require('./chunks/colorVert');
var commonFrag = require('./chunks/commonFrag');
var commonVert = require('./chunks/commonVert');
var diffuseMapFrag = require('./chunks/diffuseMapFrag');
var diffuseMapParsFrag = require('./chunks/diffuseMapParsFrag');
var directlightParsFrag = require('./chunks/directlightParsFrag');
var ditheringFrag = require('./chunks/ditheringFrag');
var ditheringParsFrag = require('./chunks/ditheringParsFrag');
var emissiveMapFrag = require('./chunks/emissiveMapFrag');
var emissiveMapParsFrag = require('./chunks/emissiveMapParsFrag');
var encodingsFrag = require('./chunks/encodingsFrag');
var encodingsParsFrag = require('./chunks/encodingsParsFrag');
var endFrag = require('./chunks/endFrag');
var envMapFrag = require('./chunks/envMapFrag');
var envMapParsFrag = require('./chunks/envMapParsFrag');
var envMapParsVert = require('./chunks/envMapParsVert');
var envMapVert = require('./chunks/envMapVert');
var fogFrag = require('./chunks/fogFrag');
var fogParsFrag = require('./chunks/fogParsFrag');
var inverse = require('./chunks/inverse');
var lightFrag = require('./chunks/lightFrag');
var lightParsFrag = require('./chunks/lightParsFrag');
var morphnormalVert = require('./chunks/morphnormalVert');
var morphtargetParsVert = require('./chunks/morphtargetParsVert');
var morphtargetVert = require('./chunks/morphtargetVert');
var normalFrag = require('./chunks/normalFrag');
var normalMapParsFrag = require('./chunks/normalMapParsFrag');
var normalParsFrag = require('./chunks/normalParsFrag');
var normalParsVert = require('./chunks/normalParsVert');
var normalVert = require('./chunks/normalVert');
var packing = require('./chunks/packing');
var pointlightParsFrag = require('./chunks/pointlightParsFrag');
var premultipliedAlphaFrag = require('./chunks/premultipliedAlphaFrag');
var pvmVert = require('./chunks/pvmVert');
var shadow = require('./chunks/shadow');
var shadowMapFrag = require('./chunks/shadowMapFrag');
var shadowMapParsFrag = require('./chunks/shadowMapParsFrag');
var shadowMapParsVert = require('./chunks/shadowMapParsVert');
var shadowMapVert = require('./chunks/shadowMapVert');
var skinningParsVert = require('./chunks/skinningParsVert');
var skinningVert = require('./chunks/skinningVert');
var skinnormalVert = require('./chunks/skinnormalVert');
var specularMapFrag = require('./chunks/specularMapFrag');
var specularMapParsFrag = require('./chunks/specularMapParsFrag');
var spotlightParsFrag = require('./chunks/spotlightParsFrag');
var transpose = require('./chunks/transpose');
var tsn = require('./chunks/tsn');
var uvParsFrag = require('./chunks/uvParsFrag');
var uvParsVert = require('./chunks/uvParsVert');
var uvVert = require('./chunks/uvVert');
var viewModelPosParsFrag = require('./chunks/viewModelPosParsFrag');
var viewModelPosParsVert = require('./chunks/viewModelPosParsVert');
var viewModelPosVert = require('./chunks/viewModelPosVert');

var ShaderChunk = {
    alphamapFrag: alphamapFrag,
    alphamapParsFrag: alphamapParsFrag,
    alphaTestFrag: alphaTestFrag,
    ambientlightParsFrag: ambientlightParsFrag,
    aoMapParsFrag: aoMapParsFrag,
    beginFrag: beginFrag,
    beginVert: beginVert,
    bsdfs: bsdfs,
    bumpMapParsFrag: bumpMapParsFrag,
    clippingPlanesFrag: clippingPlanesFrag,
    clippingPlanesParsFrag: clippingPlanesParsFrag,
    colorFrag: colorFrag,
    colorParsFrag: colorParsFrag,
    colorParsVert: colorParsVert,
    colorVert: colorVert,
    commonFrag: commonFrag,
    commonVert: commonVert,
    diffuseMapFrag: diffuseMapFrag,
    diffuseMapParsFrag: diffuseMapParsFrag,
    directlightParsFrag: directlightParsFrag,
    ditheringFrag: ditheringFrag,
    ditheringParsFrag: ditheringParsFrag,
    emissiveMapFrag: emissiveMapFrag,
    emissiveMapParsFrag: emissiveMapParsFrag,
    encodingsFrag: encodingsFrag,
    encodingsParsFrag: encodingsParsFrag,
    endFrag: endFrag,
    envMapFrag: envMapFrag,
    envMapParsFrag: envMapParsFrag,
    envMapParsVert: envMapParsVert,
    envMapVert: envMapVert,
    fogFrag: fogFrag,
    fogParsFrag: fogParsFrag,
    inverse: inverse,
    lightFrag: lightFrag,
    lightParsFrag: lightParsFrag,
    main: 'void main()',
    morphnormalVert: morphnormalVert,
    morphtargetParsVert: morphtargetParsVert,
    morphtargetVert: morphtargetVert,
    normalFrag: normalFrag,
    normalMapParsFrag: normalMapParsFrag,
    normalParsFrag: normalParsFrag,
    normalParsVert: normalParsVert,
    normalVert: normalVert,
    packing: packing,
    pointlightParsFrag: pointlightParsFrag,
    premultipliedAlphaFrag: premultipliedAlphaFrag,
    pvmVert: pvmVert,
    shadow: shadow,
    shadowMapFrag: shadowMapFrag,
    shadowMapParsFrag: shadowMapParsFrag,
    shadowMapParsVert: shadowMapParsVert,
    shadowMapVert: shadowMapVert,
    skinningParsVert: skinningParsVert,
    skinningVert: skinningVert,
    skinnormalVert: skinnormalVert,
    specularMapFrag: specularMapFrag,
    specularMapParsFrag: specularMapParsFrag,
    spotlightParsFrag: spotlightParsFrag,
    transpose: transpose,
    tsn: tsn,
    uvParsFrag: uvParsFrag,
    uvParsVert: uvParsVert,
    uvVert: uvVert,
    viewModelPosParsFrag: viewModelPosParsFrag,
    viewModelPosParsVert: viewModelPosParsVert,
    viewModelPosVert: viewModelPosVert
};

module.exports = ShaderChunk;
