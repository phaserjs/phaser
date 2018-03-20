/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Loader
 */

var Loader = {

    FileTypes: require('./filetypes'),

    File: require('./File'),
    FileTypesManager: require('./FileTypesManager'),
    GetURL: require('./GetURL'),
    LoaderPlugin: require('./LoaderPlugin'),
    MergeXHRSettings: require('./MergeXHRSettings'),
    XHRLoader: require('./XHRLoader'),
    XHRSettings: require('./XHRSettings')

};

//   Merge in the consts
Loader = Extend(false, Loader, CONST);

module.exports = Loader;
