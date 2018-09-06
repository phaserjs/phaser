/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetFastValue = require('../../../src/utils/object/GetFastValue');

/**
 * @classdesc
 * [description]
 *
 * @class FacebookInstantGamesPlugin
 * @memberOf Phaser
 * @constructor
 * @since 3.12.0
 */
var Product = function (data)
{
    return {
        title: GetFastValue(data, 'title', ''),
        productID: GetFastValue(data, 'productID', ''),
        description: GetFastValue(data, 'description', ''),
        imageURI: GetFastValue(data, 'imageURI', ''),
        price: GetFastValue(data, 'price', ''),
        priceCurrencyCode: GetFastValue(data, 'priceCurrencyCode', '')
    };
};

module.exports = Product;
