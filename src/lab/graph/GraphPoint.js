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

goog.provide('myphysicslab.lab.graph.GraphPoint');

goog.require('myphysicslab.lab.util.Util');
goog.require('myphysicslab.lab.util.GenericVector');
goog.require('myphysicslab.lab.util.Vector');

goog.scope(function() {

var NF = myphysicslab.lab.util.Util.NF;
var GenericVector = myphysicslab.lab.util.GenericVector;
var Vector = myphysicslab.lab.util.Vector;
var Util = myphysicslab.lab.util.Util;

/** A point in a 2D graph, with indication of when discontinuity occurs in a sequence
* of points.  See {@link myphysicslab.lab.graph.GraphLine}.
* @param {number} x X value of the GraphPoint
* @param {number} y Y value of the GraphPoint
* @param {number} seqX sequence number for the X value; when sequence number changes
*   between successive GraphPoints it indicates there was a discontinuity in the graph
* @param {number} seqY sequence number for the Y value; when sequence number changes
*   between successive GraphPoints it indicates there was a discontinuity in the graph
* @constructor
* @final
* @struct
* @implements {GenericVector}
*/
myphysicslab.lab.graph.GraphPoint = function(x, y, seqX, seqY) {
  /** @type {number} */
  this.x = x;
  /** @type {number} */
  this.y = y;
  /** @type {number} */
  this.seqX = seqX;
  /** @type {number} */
  this.seqY = seqY;
};
var GraphPoint = myphysicslab.lab.graph.GraphPoint;

if (!Util.ADVANCED) {
  /** @inheritDoc */
  GraphPoint.prototype.toString = function() {
    return 'GraphPoint{x: '+NF(this.x)
        +', y: '+NF(this.y)
        +', seqX: '+NF(this.seqX)
        +', seqY: '+NF(this.seqY)
        +'}';
  };
};

/** Returns whether this GraphPoint is identical to another GraphPoint
* @param {!GraphPoint} other the GraphPoint to compare with
* @return {boolean} `true` if this GraphPoint is identical to the other GraphPoint
*/
GraphPoint.prototype.equals = function(other) {
  return this.x == other.x && this.y == other.y && this.seqX == other.seqX
      && this.seqY == other.seqY;
};

/** @inheritDoc */
GraphPoint.prototype.getX = function() {
  return this.x;
};

/** @inheritDoc */
GraphPoint.prototype.getY = function() {
  return this.y;
};

/** @inheritDoc */
GraphPoint.prototype.getZ = function() {
  return 0;
};

/** @inheritDoc */
GraphPoint.prototype.immutable = function() {
  return Vector.copy(this);
};

}); // goog.scope
