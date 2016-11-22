/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

require('../const');

function DebugHeader (renderType)
{
    var c = (renderType === CONST.CANVAS) ? 'Canvas' : 'WebGL';

    if (!this.device.ie)
    {
        var args = [
            '%c %c %c %c %c Phaser v' + CONST.version + ' / ' + c + '  %c http://phaser.io',
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
        console.log('Phaser v' + CONST.version + ' / http://phaser.io');
    }

}

module.exports = DebugHeader;
