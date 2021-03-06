// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('myphysicslab.sims.roller.RollerCollision');

goog.require('myphysicslab.lab.model.Collision');
goog.require('myphysicslab.lab.util.Util');
goog.require('myphysicslab.lab.model.NumericalPath');
goog.require('myphysicslab.lab.model.PathPoint');
goog.require('myphysicslab.lab.model.PointMass');

goog.scope(function() {

var Collision = myphysicslab.lab.model.Collision;
var Util = myphysicslab.lab.util.Util;
var NF = myphysicslab.lab.util.Util.NF;
var NF5 = myphysicslab.lab.util.Util.NF5;
var NF7 = myphysicslab.lab.util.Util.NF7;
var NumericalPath = myphysicslab.lab.model.NumericalPath;
var PathPoint = myphysicslab.lab.model.PathPoint;
var PointMass = myphysicslab.lab.model.PointMass;

/** Collision used by RollerFlightSim.

* @param {!PointMass} ball
* @param {!NumericalPath} path
* @param {number} time
* @constructor
* @final
* @struct
* @implements {Collision}
*/
myphysicslab.sims.roller.RollerCollision = function(ball, path, time) {
  /**
  * @type {!PointMass}
  * @private
  */
  this.ball_ = ball;
  /**
  * @type {!NumericalPath}
  * @private
  */
  this.path_ = path;
  /**
  * @type {!PathPoint}
  * @private
  */
  this.pathPoint_ = new PathPoint();
  /** depth of collision, negative = penetration
  * @type {number}
  * @private
  */
  this.distance_ = NaN;
  /**
  * @type {number}
  * @private
  */
  this.detectedTime_ = time;
  /**
  * @type {boolean}
  * @private
  */
  this.mustHandle_ = false;
  /** the collision distance accuracy: how close we must be to the moment of
  * collision in order to be able to handle it.
  * @type {number}
  * @private
  */
  this.accuracy_ = 0.005;
  /** amount of impulse applied during collision
  * @type {number}
  * @package
  */
  this.impulse = Util.NaN;
  /** relative normal velocity between the two collision points
  * @type {number}
  * @package
  */
  this.velocity = Util.NaN;
  this.updateCollision(time);
};

var RollerCollision = myphysicslab.sims.roller.RollerCollision;

if (!Util.ADVANCED) {
  /** @inheritDoc */
  RollerCollision.prototype.toString = function() {
    return 'RollerCollision{'
        +'distance='+NF(this.distance_)
        +', accuracy='+NF(this.accuracy_)
        +', detectedTime='+NF(this.detectedTime_)
        +', impulse: '+NF5(this.impulse)
        +', velocity: '+NF5(this.velocity)
        +', position='+this.ball_.getPosition()
        +'}';
  };
};

/**
* @return {!PathPoint}
*/
RollerCollision.prototype.getPathPoint = function() {
  return this.pathPoint_;
};

/** @inheritDoc */
RollerCollision.prototype.closeEnough = function(allowTiny) {
  return Math.abs(this.distance_) <= this.accuracy_;
};

/** @inheritDoc */
RollerCollision.prototype.isTouching = function() {
  return true;
};

/** @inheritDoc */
RollerCollision.prototype.isColliding = function() {
  return this.distance_ < -this.accuracy_;
};

/** @inheritDoc */
RollerCollision.prototype.getDistance = function() {
  return this.distance_;
};

/** @inheritDoc */
RollerCollision.prototype.getDetectedTime = function() {
  return this.detectedTime_;
};

/** @inheritDoc */
RollerCollision.prototype.getEstimatedTime = function() {
  return Util.NaN;
};

/** @inheritDoc */
RollerCollision.prototype.bilateral = function() {
  return false;
};

/** @inheritDoc */
RollerCollision.prototype.contact = function() {
  return false;
};

/** @inheritDoc */
RollerCollision.prototype.illegalState = function() {
  return this.distance_ < -this.accuracy_;
};

/** @inheritDoc */
RollerCollision.prototype.setNeedsHandling = function(needsHandling) {
  this.mustHandle_ = needsHandling;
};

/** @inheritDoc */
RollerCollision.prototype.needsHandling = function() {
  return this.mustHandle_;
};

/** @inheritDoc */
RollerCollision.prototype.updateCollision = function(time) {
  // Assume that the track does not loop.
  // Then if the ball is below the track there has been a collision.
  this.pathPoint_ = new PathPoint();
  var pos = this.ball_.getPosition();
  this.pathPoint_.x = pos.getX();
  this.path_.map_x_to_y_p(this.pathPoint_);
  this.path_.map_p_to_slope(this.pathPoint_);
  this.distance_ = pos.getY() - this.pathPoint_.getY();
  var normal = this.pathPoint_.getNormal();
  this.velocity = this.ball_.getVelocity().dotProduct(normal);
};

/** @inheritDoc */
RollerCollision.prototype.getImpulse = function() {
  return this.impulse;
};

/** @inheritDoc */
RollerCollision.prototype.getVelocity = function() {
  return this.velocity;
};

}); // goog.scope
