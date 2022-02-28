/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Deep Copy the given object or array.
 *
 * @function Phaser.Utils.Objects.DeepCopy
 * @since 3.50.0
 *
 * @param {object} obj - The object to deep copy.
 *
 * @return {object} A deep copy of the original object.
 */
var DeepCopy = function (inObject)
{
    var outObject;
    var value;
    var key;

    if (typeof inObject !== 'object' || inObject === null)
    {
        //  inObject is not an object
        return inObject;
    }

    //  Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject)
    {
        value = inObject[key];

        //  Recursively (deep) copy for nested objects, including arrays
        outObject[key] = DeepCopy(value);
    }

    return outObject;
};

module.exports = DeepCopy;
