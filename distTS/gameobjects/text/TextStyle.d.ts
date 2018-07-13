/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var GetAdvancedValue: any;
declare var GetValue: any;
declare var MeasureText: (textStyle: any) => {
    ascent: number;
    descent: number;
    fontSize: number;
};
/**
 * A custom function that will be responsible for wrapping the text.
 * @callback TextStyleWordWrapCallback
 *
 * @param {string} text - The string to wrap.
 * @param {Phaser.GameObjects.Text} textObject - The Text instance.
 *
 * @return {(string|string[])} Should return the wrapped lines either as an array of lines or as a string with
 * newline characters in place to indicate where breaks should happen.
 */
declare var propertyMap: {
    fontFamily: string[];
    fontSize: string[];
    fontStyle: string[];
    backgroundColor: string[];
    color: string[];
    stroke: string[];
    strokeThickness: (string | number)[];
    shadowOffsetX: (string | number)[];
    shadowOffsetY: (string | number)[];
    shadowColor: string[];
    shadowBlur: (string | number)[];
    shadowStroke: (string | boolean)[];
    shadowFill: (string | boolean)[];
    align: string[];
    maxLines: (string | number)[];
    fixedWidth: (string | number)[];
    fixedHeight: (string | number)[];
    rtl: (string | boolean)[];
    testString: string[];
    baselineX: (string | number)[];
    baselineY: (string | number)[];
    wordWrapWidth: string[];
    wordWrapCallback: string[];
    wordWrapCallbackScope: string[];
    wordWrapUseAdvanced: (string | boolean)[];
};
/**
 * Font metrics for a Text Style object.
 *
 * @typedef {object} TextMetrics
 *
 * @property {number} ascent - The ascent of the font.
 * @property {number} descent - The descent of the font.
 * @property {number} fontSize - The size of the font.
 */
/**
 * @classdesc
 * Style settings for a Text object.
 *
 * @class TextStyle
 * @memberOf Phaser.GameObjects.Text
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Text} text - The Text object that this TextStyle is styling.
 * @param {object} style - The style settings to set.
 */
declare var TextStyle: any;
