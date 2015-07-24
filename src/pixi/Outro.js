/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PIXI;
        }
        exports.PIXI = PIXI;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('PIXI', (function() { return root.PIXI = PIXI; })() );
    } else {
        root.PIXI = PIXI;
    }

    return PIXI;
}).call(this);