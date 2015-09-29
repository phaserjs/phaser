/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* DOM utility class.
*
* Provides a useful Window and Element functions as well as cross-browser compatibility buffer.
*
* Some code originally derived from {@link https://github.com/ryanve/verge verge}.
* Some parts were inspired by the research of Ryan Van Etten, released under MIT License 2013.
* 
* @class Phaser.DOM
* @static
*/
Phaser.DOM = {

    /**
    * Get the [absolute] position of the element relative to the Document.
    *
    * The value may vary slightly as the page is scrolled due to rounding errors.
    *
    * @method Phaser.DOM.getOffset
    * @param {DOMElement} element - The targeted element that we want to retrieve the offset.
    * @param {Phaser.Point} [point] - The point we want to take the x/y values of the offset.
    * @return {Phaser.Point} - A point objet with the offsetX and Y as its properties.
    */
    getOffset: function (element, point) {

        point = point || new Phaser.Point();

        var box = element.getBoundingClientRect();

        var scrollTop = Phaser.DOM.scrollY;
        var scrollLeft = Phaser.DOM.scrollX;
        var clientTop = document.documentElement.clientTop;
        var clientLeft = document.documentElement.clientLeft;

        point.x = box.left + scrollLeft - clientLeft;
        point.y = box.top + scrollTop - clientTop;

        return point;

    }

};

Phaser.Device.whenReady(function (device) {

    // All target browsers should support page[XY]Offset.
    var scrollX = window && ('pageXOffset' in window) ?
        function () { return window.pageXOffset; } :
        function () { return document.documentElement.scrollLeft; };

    var scrollY = window && ('pageYOffset' in window) ?
        function () { return window.pageYOffset; } :
        function () { return document.documentElement.scrollTop; };

    /**
    * A cross-browser window.scrollX.
    *
    * @name Phaser.DOM.scrollX
    * @property {number} scrollX
    * @readonly
    * @protected
    */
    Object.defineProperty(Phaser.DOM, "scrollX", {
        get: scrollX
    });

    /**
    * A cross-browser window.scrollY.
    *
    * @name Phaser.DOM.scrollY
    * @property {number} scrollY
    * @readonly
    * @protected
    */
    Object.defineProperty(Phaser.DOM, "scrollY", {
        get: scrollY
    });

}, null, true);
