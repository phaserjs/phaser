/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Loader
 */

var Loader = {

    Events: require('./events'),

    FileTypes: require('./filetypes'),

    File: require('./File'),
    FileTypesManager: require('./FileTypesManager'),
    GetURL: require('./GetURL'),
    LoaderPlugin: require('./LoaderPlugin'),
    MergeXHRSettings: require('./MergeXHRSettings'),
    MultiFile: require('./MultiFile'),
    XHRLoader: require('./XHRLoader'),
    XHRSettings: require('./XHRSettings')

};

//   Merge in the consts
Loader = Extend(false, Loader, CONST);

module.exports = Loader;
