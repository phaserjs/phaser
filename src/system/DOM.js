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
    * @param {DOMElement|Object} element - The element or stack (uses first item) to get the bounds for.
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
    * @param {object} coords - An object containing the following properties: `{top: number, right: number, bottom: number, left: number}`
    * @param {number} [cushion] - A value to adjust the coordinates by.
    * @return {object} The calibrated element coordinates
    */
    calibrate: function (coords, cushion) {

        cushion = +cushion || 0;

        var output = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };

        output.width = (output.right = coords.right + cushion) - (output.left = coords.left - cushion);
        output.height = (output.bottom = coords.bottom + cushion) - (output.top = coords.top - cushion);

        return output;

    },

    /**
    * Get the Visual viewport aspect ratio (or the aspect ratio of an object or element)    
    * 
    * @method Phaser.DOM.getAspectRatio
    * @param {(DOMElement|Object)} [object=(visualViewport)] - The object to determine the aspect ratio for. Must have public `width` and `height` properties or methods.
    * @return {number} The aspect ratio.
    */
    getAspectRatio: function (object) {

        object = null == object ? this.visualBounds : 1 === object.nodeType ? this.getBounds(object) : object;

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
    * Tests if the given DOM element is within the Layout viewport.
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
    inLayoutViewport: function (element, cushion) {

        var r = this.getBounds(element, cushion);

        return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= this.layoutBounds.width && r.left <= this.layoutBounds.height;

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
    * - window.orientation - If fallback is 'window.orientation', works iOS and probably most Android; non-recommended track.
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
            return (this.visualBounds.height > this.visualBounds.width) ? PORTRAIT : LANDSCAPE;
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
            else if (window.matchMedia("(orientation: landscape)").matches)
            {
                return LANDSCAPE;
            }
        }

        return (this.visualBounds.height > this.visualBounds.width) ? PORTRAIT : LANDSCAPE;

    },

    /**
    * The bounds of the Visual viewport, as discussed in 
    * {@link http://www.quirksmode.org/mobile/viewports.html A tale of two viewports — part one}
    * with one difference: the viewport size _excludes_ scrollbars, as found on some desktop browsers.   
    *
    * Supported mobile:
    *   iOS/Safari, Android 4, IE10, Firefox OS (maybe not Firefox Android), Opera Mobile 16
    *
    * The properties change dynamically.
    *
    * @type {Phaser.Rectangle}
    * @property {number} x - Scroll, left offset - eg. "scrollX"
    * @property {number} y - Scroll, top offset - eg. "scrollY"
    * @property {number} width - Viewport width in pixels.
    * @property {number} height - Viewport height in pixels.
    * @readonly
    */
    visualBounds: new Phaser.Rectangle(),

    /**
    * The bounds of the Layout viewport, as discussed in 
    * {@link http://www.quirksmode.org/mobile/viewports2.html A tale of two viewports — part two};
    * but honoring the constraints as specified applicable viewport meta-tag.
    *
    * The bounds returned are not guaranteed to be fully aligned with CSS media queries (see
    * {@link http://www.matanich.com/2013/01/07/viewport-size/ What size is my viewport?}).
    *
    * This is _not_ representative of the Visual bounds: in particular the non-primary axis will
    * generally be significantly larger than the screen height on mobile devices when running with a
    * constrained viewport.
    *
    * The properties change dynamically.
    *
    * @type {Phaser.Rectangle}
    * @property {number} width - Viewport width in pixels.
    * @property {number} height - Viewport height in pixels.
    * @readonly
    */
    layoutBounds: new Phaser.Rectangle(),

    /**
    * The size of the document / Layout viewport.
    *
    * This incorrectly reports the dimensions in IE.
    *
    * The properties change dynamically.
    *
    * @type {Phaser.Rectangle}
    * @property {number} width - Document width in pixels.
    * @property {number} height - Document height in pixels.
    * @readonly
    */
    documentBounds: new Phaser.Rectangle()

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

    Object.defineProperty(Phaser.DOM.visualBounds, "x", {
        get: scrollX
    });

    Object.defineProperty(Phaser.DOM.visualBounds, "y", {
        get: scrollY
    });

    Object.defineProperty(Phaser.DOM.layoutBounds, "x", {
        value: 0
    });

    Object.defineProperty(Phaser.DOM.layoutBounds, "y", {
        value: 0
    });

    var treatAsDesktop = device.desktop &&
        (document.documentElement.clientWidth <= window.innerWidth) &&
        (document.documentElement.clientHeight <= window.innerHeight);

    // Desktop browsers align the layout viewport with the visual viewport.
    // This differs from mobile browsers with their zooming design.
    // Ref. http://quirksmode.org/mobile/tableViewport.html  
    if (treatAsDesktop)
    {

        var clientWidth = function () {
            return document.documentElement.clientWidth;
        };
        var clientHeight = function () {
            return document.documentElement.clientHeight;
        };

        // Interested in area sans-scrollbar
        Object.defineProperty(Phaser.DOM.visualBounds, "width", {
            get: clientWidth
        });

        Object.defineProperty(Phaser.DOM.visualBounds, "height", {
            get: clientHeight
        });

        Object.defineProperty(Phaser.DOM.layoutBounds, "width", {
            get: clientWidth
        });

        Object.defineProperty(Phaser.DOM.layoutBounds, "height", {
            get: clientHeight
        });

    } else {

        Object.defineProperty(Phaser.DOM.visualBounds, "width", {
            get: function () {
                return window.innerWidth;
            }
        });

        Object.defineProperty(Phaser.DOM.visualBounds, "height", {
            get: function () {
                return window.innerHeight;
            }
        });

        Object.defineProperty(Phaser.DOM.layoutBounds, "width", {

            get: function () {
                var a = document.documentElement.clientWidth;
                var b = window.innerWidth;

                return a < b ? b : a; // max
            }

        });

        Object.defineProperty(Phaser.DOM.layoutBounds, "height", {

            get: function () {
                var a = document.documentElement.clientHeight;
                var b = window.innerHeight;

                return a < b ? b : a; // max
            }

        });

    }

    // For Phaser.DOM.documentBounds
    // Ref. http://www.quirksmode.org/mobile/tableViewport_desktop.html

    Object.defineProperty(Phaser.DOM.documentBounds, "x", {
        value: 0
    });

    Object.defineProperty(Phaser.DOM.documentBounds, "y", {
        value: 0
    });

    Object.defineProperty(Phaser.DOM.documentBounds, "width", {

        get: function () {
            var d = document.documentElement;
            return Math.max(d.clientWidth, d.offsetWidth, d.scrollWidth);
        }

    });

    Object.defineProperty(Phaser.DOM.documentBounds, "height", {

        get: function () {
            var d = document.documentElement;
            return Math.max(d.clientHeight, d.offsetHeight, d.scrollHeight);
        }

    });

}, null, true);
