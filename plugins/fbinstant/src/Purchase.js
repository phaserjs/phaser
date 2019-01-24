/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetFastValue = require('../../../src/utils/object/GetFastValue');

/**
 * @typedef {object} Purchase
 *
 * @property {string} [developerPayload] - A developer-specified string, provided during the purchase of the product.
 * @property {string} [paymentID] - The identifier for the purchase transaction.
 * @property {string} [productID] - The product's game-specified identifier.
 * @property {string} [purchaseTime] - Unix timestamp of when the purchase occurred.
 * @property {string} [purchaseToken] - A token representing the purchase that may be used to consume the purchase.
 * @property {string} [signedRequest] - Server-signed encoding of the purchase request.
 */

var Purchase = function (data)
{
    return {
        developerPayload: GetFastValue(data, 'developerPayload', ''),
        paymentID: GetFastValue(data, 'paymentID', ''),
        productID: GetFastValue(data, 'productID', ''),
        purchaseTime: GetFastValue(data, 'purchaseTime', ''),
        purchaseToken: GetFastValue(data, 'purchaseToken', ''),
        signedRequest: GetFastValue(data, 'signedRequest', '')
    };
};

module.exports = Purchase;
