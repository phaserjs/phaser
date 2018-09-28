/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetFastValue = require('../../../src/utils/object/GetFastValue');

/**
 * @typedef {object} Product
 *
 * @property {string} [title] - The title of the product.
 * @property {string} [productID] - The product's game-specified identifier.
 * @property {string} [description] - The product description.
 * @property {string} [imageURI] - A link to the product's associated image.
 * @property {string} [price] - The price of the product.
 * @property {string} [priceCurrencyCode] - The currency code for the product.
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
