/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AddToDOM = require('../dom/AddToDOM');

var CreateDOMContainer = function (game)
{
    var config = game.config;

    if (!config.parent || !config.domCreateContainer)
    {
        return;
    }

    //  DOM Element Container
    var div = document.createElement('div');

    div.style.cssText = [
        'display: block;',
        'width: ' + game.scale.width + 'px;',
        'height: ' + game.scale.height + 'px;',
        'padding: 0; margin: 0;',
        'position: absolute;',
        'overflow: hidden;',
        'pointer-events: ' + config.domPointerEvents + ';',
        'transform: scale(1);',
        'transform-origin: left top;'
    ].join(' ');

    game.domContainer = div;

    AddToDOM(div, config.parent);
};

module.exports = CreateDOMContainer;
