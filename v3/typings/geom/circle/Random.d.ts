import Circle from './Circle';
/**
* Returns a uniformly distributed random point from anywhere within this Circle.
*
* @method Phaser.Circle#random
* @param {Phaser.Point|object} [out] - A Phaser.Point, or any object with public x/y properties, that the values will be set in.
*     If no object is provided a new Phaser.Point object will be created. In high performance areas avoid this by re-using an existing object.
* @return {Phaser.Point} An object containing the random point in its `x` and `y` properties.
*/
export default function (circle: Circle, out: any): any;
