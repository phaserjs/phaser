/**
* @author       Steven Rogers <soldoutactivist@gmail.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* This is a stub for the Phaser Net Class.
* It allows you to exclude the default Net from your build, without making Game crash.
*/

var netNoop = function () {};

Phaser.Net = netNoop;

Phaser.Net.prototype = {
    isDisabled: true,

    getHostName: netNoop,
    checkDomainName: netNoop,
    updateQueryString: netNoop,
    getQueryString: netNoop,
    decodeURI: netNoop
};

Phaser.Net.prototype.constructor = Phaser.Net;
