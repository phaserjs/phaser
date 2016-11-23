/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../const');

var DebugHeader = function (renderType, ie)
{
    var c = (renderType === CONST.CANVAS) ? 'Canvas' : 'WebGL';

    if (!ie)
    {
        var args = [
            '%c %c %c %c %c Phaser v' + CONST.VERSION + ' / ' + c + '  %c http://phaser.io',
            'background: #ff0000',
            'background: #ffff00',
            'background: #00ff00',
            'background: #00ffff',
            'color: #ffffff; background: #000;',
            'background: #fff'
        ];

        console.log.apply(console, args);
    }
    else if (window['console'])
    {
        console.log('Phaser v' + CONST.VERSION + ' / http://phaser.io');
    }

};

module.exports = DebugHeader;
