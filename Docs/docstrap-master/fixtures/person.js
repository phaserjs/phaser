"use strict"
/**
 @fileOverview Donec sed sapien enim. Duis elementum arcu id velit mattis sed tincidunt dolor posuere. Cras dapibus varius metus et sollicitudin. Quisque egestas placerat lacus, at lobortis mauris volutpat in. Morbi eleifend, sapien ut lobortis malesuada, nulla arcu blandit risus, quis fringilla nunc leo ac turpis. Donec vitae gravida dolor. Pellentesque accumsan, erat ac rutrum sodales, neque odio pellentesque est, vitae rutrum lorem mauris vitae justo. Sed blandit egestas mi at fringilla. Morbi at metus feugiat magna tempor vulputate. Duis dictum sagittis neque quis tempor. Morbi id est ac orci dictum porta. Phasellus tempus adipiscing convallis.
 @module docstrap/person
 @author Fred Flinstone
 @requires lodash
 @requires docstrap/person
 */

/**
 * Integer quis ante ut nulla cursus vehicula id eu dolor. Phasellus ut facilisis felis. Praesent eget metus id massa pretium lobortis a et metus. Aliquam erat volutpat. Nulla ac tortor odio, quis facilisis augue. In hendrerit, lectus mollis elementum vestibulum, velit nisi aliquet orci, vitae luctus risus dui sed nisi. Donec aliquam pretium leo sed ultrices. Duis porttitor pharetra vulputate. Aenean sed neque sit amet arcu auctor placerat eget ac tellus. Proin porttitor fringilla eros quis scelerisque. Aliquam erat volutpat.
 * @constructor
 */
exports.Person = function () {

	/**
	 * Aenean commodo lorem nec sapien suscipit quis hendrerit dui feugiat. Curabitur pretium congue sollicitudin. Nam eleifend ultricies libero vel iaculis. Maecenas vel elit vel lorem lacinia pellentesque. Vestibulum posuere suscipit lacus, sit amet volutpat erat sagittis vitae. Ut eleifend pretium nulla vitae tempor.
	 * @type {number}
	 */
	this.eyes = 2;
	/**
	 * Donec tempus vestibulum nunc. Fusce at eleifend nisi. Proin nisl odio, ultrices fermentum eleifend nec, pellentesque in massa. Cras id turpis diam, vitae fringilla turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam tempus urna in lacus semper sodales. Etiam a erat in augue rhoncus porta. Aenean nec odio lorem, a tristique dui.
	 * @type {number}
	 */
	this.nose = 1;
	/**
	 * Vestibulum viverra magna nec lectus imperdiet in lacinia ante iaculis. Cras nec urna tellus, eget convallis mauris. Fusce volutpat elementum enim, vel fringilla orci elementum vehicula. Nunc in ultrices sem. Sed augue tortor, pellentesque sed suscipit sed, vehicula eu enim.
	 * @type {number}
	 */
	this.mouth = 1;
};

/**
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi congue viverra placerat. Mauris mi nibh, pulvinar ut placerat sit amet, aliquam a diam. Maecenas vitae suscipit nulla. Sed at justo nec ante lobortis fermentum. Quisque sodales libero suscipit mi malesuada pretium. Cras a lectus vitae risus semper sagittis. Sed ultrices aliquet tempus. Nulla id nisi metus, sit amet elementum tortor. Nunc tempor sem quis augue tempor sed posuere nulla volutpat. Phasellus fringilla pulvinar lorem quis venenatis.
 * @param {boolean} speed  Phasellus ut facilisis felis.
 */
exports.Person.prototype.walk = function ( speed ) {

};

/**
 * Aliquam interdum lectus ac diam tincidunt vitae fringilla justo faucibus.
 * @param {Boolean} well Morbi sit amet tellus at justo tempus tristique.
 * @param {function(err)} done Curabitur id nulla mauris, id hendrerit magna.
 * @param {object=} done.err Sed pulvinar mollis arcu, at tempus dui egestas cursus.
 */
exports.Person.prototype.think = function ( well, done ) {

};

/**
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi congue viverra placerat. Mauris mi nibh, pulvinar ut placerat sit amet, aliquam a diam. Maecenas vitae suscipit nulla. Sed at justo nec ante lobortis fermentum. Quisque sodales libero suscipit mi malesuada pretium. Cras a lectus vitae risus semper sagittis. Sed ultrices aliquet tempus. Nulla id nisi metus, sit amet elementum tortor. Nunc tempor sem quis augue tempor sed posuere nulla volutpat. Phasellus fringilla pulvinar lorem quis venenatis.
 * @returns {boolean} Sed id erat ut ipsum scelerisque venenatis at nec mauris.
 * @fires module:docstrap/person.Person#sneeze
 */
exports.Person.prototype.tickle = function () {

};

/**
 * Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
 *
 * @event module:docstrap/person.Person#sneeze
 * @type {object}
 * @property {boolean} tissue Phasellus non justo a neque pharetra sagittis.
 */

/**
 * Nulla ultricies justo ac nisi consectetur posuere. Donec ornare pharetra erat, nec facilisis dui cursus quis. Quisque porttitor porttitor orci, sed facilisis urna facilisis sed. Sed tincidunt adipiscing turpis et hendrerit. Cras posuere orci ut mauris ullamcorper vitae laoreet nisi luctus. In rutrum tristique augue. Nam eleifend dignissim dui.
 * @returns {exports.Person}
 */
exports.create = function(){

};
