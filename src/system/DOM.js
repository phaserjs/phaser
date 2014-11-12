/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* DOM utility class.
*
* Provides a useful Window and Element functions as well as cross-browser compatibility buffer.
*
* @class Phaser.DOM
* @static
*/
Phaser.DOM = {

    /**
    * Get the DOM offset values of any given element
    *
    * @method Phaser.DOM.getOffset
    * @param {DOMElement} element - The targeted element that we want to retrieve the offset.
    * @param {Phaser.Point} [point] - The point we want to take the x/y values of the offset.
    * @return {Phaser.Point} - A point objet with the offsetX and Y as its properties.
    */
    getOffset: function (element, point) {

        point = point || new Phaser.Point();

        var box = element.getBoundingClientRect();
        var clientTop = element.clientTop || document.body.clientTop || 0;
        var clientLeft = element.clientLeft || document.body.clientLeft || 0;

        //  Without this check Chrome is now throwing console warnings about strict vs. quirks :(

        var scrollTop = 0;
        var scrollLeft = 0;

        if (document.compatMode === 'CSS1Compat')
        {
            scrollTop = window.pageYOffset || document.documentElement.scrollTop || element.scrollTop || 0;
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || element.scrollLeft || 0;
        }
        else
        {
            scrollTop = window.pageYOffset || document.body.scrollTop || element.scrollTop || 0;
            scrollLeft = window.pageXOffset || document.body.scrollLeft || element.scrollLeft || 0;
        }

        point.x = box.left + scrollLeft - clientLeft;
        point.y = box.top + scrollTop - clientTop;

        return point;

    },

    /**
    * A cross-browser element.getBoundingClientRect method with optional cushion.
    * 
    * Returns a plain object containing the properties `top/bottom/left/right/width/height` with respect to the top-left corner of the current viewport.
    * Its properties match the native rectangle.
    * The cushion parameter is an amount of pixels (+/-) to cushion the element.
    * It adjusts the measurements such that it is possible to detect when an element is near the viewport.
    * 
    * @method Phaser.DOM.getBounds
    * @param {DOMElement|Object} element - The element or stack (uses first item) to get the bounds for. If none given it defaults to the Phaser game canvas.
    * @param {number} [cushion] - A +/- pixel adjustment amount.
    * @return {Object|boolean} A plain object containing the properties `top/bottom/left/right/width/height` or `false` if a non-valid element is given.
    */
    getBounds: function (element, cushion) {

        if (typeof cushion === 'undefined') { cushion = 0; }

        element = element && !element.nodeType ? element[0] : element;

        if (!element || element.nodeType !== 1)
        {
            return false;
        }
        else
        {
            return this.calibrate(element.getBoundingClientRect(), cushion);
        }

    },

    /**
    * Calibrates element coordinates for `inViewport` checks.
    *
    * @method Phaser.DOM.calibrate
    * @private
    * @param {Object} coords - An object containing the following properties: `{top: number, right: number, bottom: number, left: number}`
    * @param {number} [cushion] - A value to adjust the coordinates by.
    * @return {Object} The calibrated element coordinates
    */
    calibrate: function (coords, cushion) {

        cushion = +cushion || 0;

        var output = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };

        output.width = (output.right = coords.right + cushion) - (output.left = coords.left - cushion);
        output.height = (output.bottom = coords.bottom + cushion) - (output.top = coords.top - cushion);

        return output;

    },

    /**
    * Get the viewport aspect ratio (or the aspect ratio of an object or element)
    * @link http://w3.org/TR/css3-mediaqueries/#orientation
    * 
    * @method Phaser.DOM.getAspectRatio
    * @param {(DOMElement|Object)} [object=(viewport)] - Optional object. Must have public `width` and `height` properties or methods.
    * @return {number} The aspect ratio.
    */
    getAspectRatio: function (object) {

        object = null == object ? this.getViewport() : 1 === object.nodeType ? this.getElementBounds(object) : object;

        var w = object['width'];
        var h = object['height'];

        if (typeof w === 'function')
        {
            w = w.call(object);
        }

        if (typeof h === 'function')
        {
            h = h.call(object);
        }

        return w / h;

    },

    /**
    * Get the viewport dimensions.
    *
    * @method Phaser.DOM#getViewport
    * @protected
    */
    getViewport: function () {

        return {
            width: this.viewportWidth,
            height: this.viewportHeight
        };

    },

    /**
    * Tests if the given DOM element is within the viewport.
    * 
    * The optional cushion parameter allows you to specify a distance.
    * 
    * inViewport(element, 100) is `true` if the element is in the viewport or 100px near it.
    * inViewport(element, -100) is `true` if the element is in the viewport or at least 100px near it.
    * 
    * @method Phaser.DOM.inViewport
    * @param {DOMElement|Object} element - The DOM element to check. If no element is given it defaults to the Phaser game canvas.
    * @param {number} [cushion] - The cushion allows you to specify a distance within which the element must be within the viewport.
    * @return {boolean} True if the element is within the viewport, or within `cushion` distance from it.
    */
    inViewport: function (element, cushion) {

        var r = this.getElementBounds(element, cushion);

        return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= this.viewportWidth && r.left <= this.viewportHeight;

    },

    /**
    * Returns the device screen orientation.
    *
    * Orientation values: 'portrait-primary', 'landscape-primary', 'portrait-secondary', 'landscape-secondary'.
    *
    * Order of resolving:
    * - Screen Orientation API, or variation of - Future track. Most desktop and mobile browsers.
    * - Screen size ratio check - If fallback is 'screen', suited for desktops.
    * - Viewport size ratio check - If fallback is 'viewport', suited for mobile.
    * - window.orientation - If fallback is 'window.orientation', non-recommended track.
    * - Media query
    * - Viewport size ratio check (probably only IE9 and legacy mobile gets here..)
    *
    * See
    * - https://w3c.github.io/screen-orientation/ (conflicts with mozOrientation/msOrientation)
    * - https://developer.mozilla.org/en-US/docs/Web/API/Screen.orientation (mozOrientation)
    * - http://msdn.microsoft.com/en-us/library/ie/dn342934(v=vs.85).aspx
    * - https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Testing_media_queries
    * - http://stackoverflow.com/questions/4917664/detect-viewport-orientation
    * - http://www.matthewgifford.com/blog/2011/12/22/a-misconception-about-window-orientation
    *
    * @method Phaser.DOM.getScreenOrientation
    * @protected
    * @param {string} [primaryFallback=(none)] - Specify 'screen', 'viewport', or 'window.orientation'.
    */
    getScreenOrientation: function (primaryFallback) {

        var screen = window.screen;
        var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;

        if (orientation && typeof orientation.type === 'string')
        {
            // Screen Orientation API specification
            return orientation.type;
        }
        else if (typeof orientation === 'string')
        {
            // moz/ms-orientation are strings
            return orientation;
        }

        var PORTRAIT = 'portrait-primary';
        var LANDSCAPE = 'landscape-primary';
        
        if (primaryFallback === 'screen')
        {
            return (screen.height > screen.width) ? PORTRAIT : LANDSCAPE;
        }
        else if (primaryFallback === 'viewport')
        {
            return (this.viewportHeight > this.viewportWidth) ? PORTRAIT : LANDSCAPE;
        }
        else if (primaryFallback === 'window.orientation' && typeof window.orientation === 'number')
        {
            // This may change by device based on "natural" orientation.
            return (window.orientation === 0 || window.orientation === 180) ? PORTRAIT : LANDSCAPE;
        }
        else if (window.matchMedia)
        {
            if (window.matchMedia("(orientation: portrait)").matches)
            {
                return PORTRAIT;
            }
            else if (window.matchMedia && window.matchMedia("(orientation: landscape)").matches)
            {
                return LANDSCAPE;
            }
        }

        return (this.viewportHeight > this.viewportWidth) ? PORTRAIT : LANDSCAPE;

    }

};

/**
* A cross-browser window.scrollX.
*
* @name Phaser.DOM.scrollX
* @property {number} scrollX
* @readonly
* @protected
*/
Object.defineProperty(Phaser.DOM, "scrollX", {

    get: function () {
        return window.pageXOffset || document.documentElement.scrollLeft;
    }

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

    get: function () {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

});

/**
* Gets the viewport width in pixels.
*
* @name Phaser.DOM.viewportWidth
* @property {number} viewportWidth
* @readonly
* @protected
*/
Object.defineProperty(Phaser.DOM, "viewportWidth", {

    get: function () {

        var a = document.documentElement.clientWidth;
        var b = window.innerWidth;

        return a < b ? b : a;

    }

});

/**
* Gets the viewport height in pixels.
*
* @name Phaser.DOM.viewportHeight
* @property {number} viewportHeight
* @readonly
* @protected
*/
Object.defineProperty(Phaser.DOM, "viewportHeight", {

    get: function () {

        var a = document.documentElement.clientHeight;
        var b = window.innerHeight;

        return a < b ? b : a;

    }

});

/**
* Gets the document width in pixels.
*
* @name Phaser.DOM.documentWidth
* @property {number} documentWidth
* @readonly
* @protected
*/
Object.defineProperty(Phaser.DOM, "documentWidth", {

    get: function () {

        var d = document.documentElement;
        return Math.max(d.clientWidth, d.offsetWidth, d.scrollWidth);

    }

});

/**
* Gets the document height in pixels.
*
* @name Phaser.DOM.documentHeight
* @property {number} documentHeight
* @readonly
* @protected
*/
Object.defineProperty(Phaser.DOM, "documentHeight", {

    get: function () {

        var d = document.documentElement;
        return Math.max(d.clientHeight, d.offsetHeight, d.scrollHeight);

    }

});
