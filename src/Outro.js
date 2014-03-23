/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Phaser;
        }
        exports.Phaser = Phaser;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('Phaser', (function() { return root.Phaser = Phaser; }) ());
    } else {
        root.Phaser = Phaser;
    }
}).call(this);
