/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Recursively deep copies the given object or array, returning a brand new instance with all
 * nested objects and arrays also cloned. The original object is not modified. If a non-object
 * value is passed (such as a string, number, boolean, or null), it is returned as-is.
 *
 * @function Phaser.Utils.Objects.DeepCopy
 * @since 3.50.0
 *
 * @param {object} inObject - The object or array to deep copy.
 *
 * @return {object} A deep copy of the original object or array.
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
