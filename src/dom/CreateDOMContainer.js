/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AddToDOM = require('../dom/AddToDOM');

/**
 * Creates a DOM container div element for use with DOM Game Objects.
 *
 * The container is an absolutely positioned div that overlays the game canvas,
 * matching its dimensions, and is added to the game's parent element.
 * It has pointer events set according to the game configuration and
 * serves as the parent for any DOM Element Game Objects added to a Scene.
 *
 * This function is called automatically during game boot if the game config
 * has both a `parent` element and `domCreateContainer` set to `true`.
 *
 * @function Phaser.DOM.CreateDOMContainer
 * @since 3.12.0
 *
 * @param {Phaser.Game} game - The Phaser Game instance to create the DOM container for.
 */
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
