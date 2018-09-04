/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetFastValue = require('../../../src/utils/object/GetFastValue');

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
