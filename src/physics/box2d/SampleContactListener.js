/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

//box2d.b2ContactListener
Phaser.Physics.Box2D.SampleContactListener = function(){
}

Phaser.Physics.Box2D.SampleContactListener.prototype = {
  BeginContact: function (contact){
    phaserBody = contact.GetFixtureA().GetBody().GetUserData();
    if(phaserBody){
      phaserBody.startContact()
    }

    phaserBody = contact.GetFixtureB().GetBody().GetUserData();
    if(phaserBody){
      phaserBody.startContact()
    }
    //console.log('BeginContact')
  },
  /** 
 * Called when two fixtures cease to touch. 
 * @export 
 * @return {void} 
 * @param {box2d.b2Contact} contact 
 */
  EndContact: function (contact){
    phaserBody = contact.GetFixtureA().GetBody().GetUserData();
    if(phaserBody){
      phaserBody.endContact()
    }

    phaserBody = contact.GetFixtureB().GetBody().GetUserData();
    if(phaserBody){
      phaserBody.endContact()
    }
  },

  /** 
 * This is called after a contact is updated. This allows you to 
 * inspect a contact before it goes to the solver. If you are 
 * careful, you can modify the contact manifold (e.g. disable 
 * contact). 
 * A copy of the old manifold is provided so that you can detect 
 * changes. 
 * Note: this is called only for awake bodies. 
 * Note: this is called even when the number of contact points 
 * is zero. 
 * Note: this is not called for sensors. 
 * Note: if you set the number of contact points to zero, you 
 * will not get an EndContact callback. However, you may get a 
 * BeginContact callback the next step. 
 * @export 
 * @return {void} 
 * @param {box2d.b2Contact} contact 
 * @param {box2d.b2Manifold} oldManifold 
 */
  PreSolve: function (contact, oldManifold){
  },
  PostSolve: function (contact, oldManifold){
  }

}
