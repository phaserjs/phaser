/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  This is from the quickselect npm package: https://www.npmjs.com/package/quickselect
//  Coded by https://www.npmjs.com/~mourner (Vladimir Agafonkin)

// https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm

// Floyd-Rivest selection algorithm:
// Rearrange items so that all items in the [left, k] range are smaller than all items in (k, right];
// The k-th element will have the (k - left + 1)th smallest value in [left, right]

/**
 * [description]
 *
 * @function Phaser.Utils.Array.QuickSelect
 * @since 3.0.0
 *
 * @param {[type]} arr - [description]
 * @param {[type]} k - [description]
 * @param {[type]} left - [description]
 * @param {[type]} right - [description]
 * @param {[type]} compare - [description]
 */
var QuickSelect = function (arr, k, left, right, compare)
{
    left = left || 0;
    right = right || (arr.length - 1);
    compare = compare || defaultCompare;

    while (right > left)
    {
        if (right - left > 600)
        {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));

            QuickSelect(arr, k, newLeft, newRight, compare);
        }

        var t = arr[k];
        var i = left;
        var j = right;

        swap(arr, left, k);

        if (compare(arr[right], t) > 0)
        {
            swap(arr, left, right);
        }

        while (i < j)
        {
            swap(arr, i, j);

            i++;
            j--;

            while (compare(arr[i], t) < 0)
            {
                i++;
            }

            while (compare(arr[j], t) > 0)
            {
                j--;
            }
        }

        if (compare(arr[left], t) === 0)
        {
            swap(arr, left, j);
        }
        else
        {
            j++;
            swap(arr, j, right);
        }

        if (j <= k)
        {
            left = j + 1;
        }

        if (k <= j)
        {
            right = j - 1;
        }
    }
};

function swap (arr, i, j)
{
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function defaultCompare (a, b)
{
    return a < b ? -1 : a > b ? 1 : 0;
}

module.exports = QuickSelect;
