"use strict"
/**
 @fileOverview Donec sed sapien enim. Duis elementum arcu id velit mattis sed tincidunt dolor posuere. Cras dapibus varius metus et sollicitudin. Quisque egestas placerat lacus, at lobortis mauris volutpat in. Morbi eleifend, sapien ut lobortis malesuada, nulla arcu blandit risus, quis fringilla nunc leo ac turpis. Donec vitae gravida dolor. Pellentesque accumsan, erat ac rutrum sodales, neque odio pellentesque est, vitae rutrum lorem mauris vitae justo. Sed blandit egestas mi at fringilla. Morbi at metus feugiat magna tempor vulputate. Duis dictum sagittis neque quis tempor. Morbi id est ac orci dictum porta. Phasellus tempus adipiscing convallis.
 @module docstrap/car
 @author Gloria Swanson
 @requires lodash
 */


/**
 * Integer quis ante ut nulla cursus vehicula id eu dolor. Phasellus ut facilisis felis. Praesent eget metus id massa pretium lobortis a et metus. Aliquam erat volutpat. Nulla ac tortor odio, quis facilisis augue. In hendrerit, lectus mollis elementum vestibulum, velit nisi aliquet orci, vitae luctus risus dui sed nisi. Donec aliquam pretium leo sed ultrices. Duis porttitor pharetra vulputate. Aenean sed neque sit amet arcu auctor placerat eget ac tellus. Proin porttitor fringilla eros quis scelerisque. Aliquam erat volutpat.
 * @constructor
 * @param {Boolean} hybrid Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
 * @example
 *  // Duis elementum arcu id velit mattis sed tincidunt dolor posuere.
 *  if (!(key in this.visited)) {
        this.visited[key] = true;

        if (this.dependencies[key]) {
            Object.keys(this.dependencies[key]).forEach(function(path) {
                self.visit(path);
            });
        }

        this.sorted.push(key);
    }
 */
exports.Car = function (hybrid) {

	/**
	 * Aenean commodo lorem nec sapien suscipit quis hendrerit dui feugiat. Curabitur pretium congue sollicitudin. Nam eleifend ultricies libero vel iaculis. Maecenas vel elit vel lorem lacinia pellentesque. Vestibulum posuere suscipit lacus, sit amet volutpat erat sagittis vitae. Ut eleifend pretium nulla vitae tempor.
	 * @type {string}
	 */
	this.color = null;

};


/**
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi congue viverra placerat. Mauris mi nibh, pulvinar ut placerat sit amet, aliquam a diam. Maecenas vitae suscipit nulla. Sed at justo nec ante lobortis fermentum. Quisque sodales libero suscipit mi malesuada pretium. Cras a lectus vitae risus semper sagittis. Sed ultrices aliquet tempus. Nulla id nisi metus, sit amet elementum tortor. Nunc tempor sem quis augue tempor sed posuere nulla volutpat. Phasellus fringilla pulvinar lorem quis venenatis.
 * @param {integer} speed  Phasellus ut facilisis felis.
 */
exports.Car.prototype.drive = function ( speed ) {

};
