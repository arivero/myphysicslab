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

goog.provide('myphysicslab.lab.view.DisplayConnector');

goog.require('myphysicslab.lab.engine2D.Connector');
goog.require('myphysicslab.lab.util.Util');
goog.require('myphysicslab.lab.util.Vector');
goog.require('myphysicslab.lab.view.DisplayObject');

goog.scope(function() {

var Connector = myphysicslab.lab.engine2D.Connector;
var NF5 = myphysicslab.lab.util.Util.NF5;
var Util = myphysicslab.lab.util.Util;
var Vector = myphysicslab.lab.util.Vector;

/** Shows the location of a {@link Connector} as a small colored circle.
The {@link #radius} is specified in screen coordinates, so the size of the circle stays
the same regardless of the zoom level on the {@link myphysicslab.lab.view.SimView}.

The position is determined by the position of the Connector, so {@link #setPosition}
has no effect, and the DisplayConnector is never dragable.

* @param {?Connector=} connector the Connector to display
* @param {?DisplayConnector=} proto the prototype DisplayConnector to inherit
*    properties from
* @constructor
* @final
* @struct
* @implements {myphysicslab.lab.view.DisplayObject}
*/
myphysicslab.lab.view.DisplayConnector = function(connector, proto) {
  /**
  * @type {?Connector}
  * @private
  */
  this.connector_ = goog.isDefAndNotNull(connector) ? connector : null;
  /** Color to draw the joint, a CSS3 color value.
  * @type {string|undefined}
  * @private
  */
  this.color_;
  /** Radius of circle to draw, in screen coordinates.
  * @type {number|undefined}
  * @private
  */
  this.radius_;
  /**
  * @type {number|undefined}
  * @private
  */
  this.zIndex_;
  /**
  * @type {?DisplayConnector}
  * @private
  */
  this.proto_ = goog.isDefAndNotNull(proto) ? proto : null;
};
var DisplayConnector = myphysicslab.lab.view.DisplayConnector;

if (!Util.ADVANCED) {
  /** @inheritDoc */
  DisplayConnector.prototype.toString = function() {
    return this.toStringShort().slice(0, -1)
        +', radius: '+NF5(this.getRadius())
        +', color: "'+this.getColor()+'"'
        +', zIndex: '+this.getZIndex()
        +', proto: '+(this.proto_ != null ? this.proto_.toStringShort() : 'null')
        +'}';
  };

  /** @inheritDoc */
  DisplayConnector.prototype.toStringShort = function() {
    return 'DisplayConnector{connector_: '+
        (this.connector_ != null ? this.connector_.toStringShort() : 'null')+'}';
  };
}

/** @inheritDoc */
DisplayConnector.prototype.contains = function(p_world) {
  return false;
};

/** @inheritDoc */
DisplayConnector.prototype.draw = function(context, map) {
  if (this.connector_ == null) {
    return;
  }
  // Use CoordMap.simToScreenRect to calc screen coords of the shape.
  context.save();
  context.fillStyle = this.getColor();
  var p = map.simToScreen(this.getPosition());
  context.translate(p.getX(), p.getY());
  context.beginPath();
  //var r = map.screenToSimScaleX(this.radius_);
  context.arc(0, 0, this.getRadius(), 0, 2*Math.PI, false);
  context.closePath();
  context.fill();
  context.restore();
};

/** @inheritDoc */
DisplayConnector.prototype.isDragable = function() {
  return false;
};

/** Color to draw the joint, a CSS3 color value.
* @return {string}
*/
DisplayConnector.prototype.getColor = function() {
  if (this.color_ !== undefined) {
    return this.color_;
  } else if (this.proto_ != null) {
    return this.proto_.getColor();
  } else {
    return 'blue';
  }
};

/** @inheritDoc */
DisplayConnector.prototype.getMassObjects = function() {
  return [];
};

/** @inheritDoc */
DisplayConnector.prototype.getPosition = function() {
  return this.connector_ == null ? Vector.ORIGIN : this.connector_.getPosition1();
};

/** Radius of circle to draw, in screen coordinates.
* @return {number}
*/
DisplayConnector.prototype.getRadius = function() {
  if (this.radius_ !== undefined) {
    return this.radius_;
  } else if (this.proto_ != null) {
    return this.proto_.getRadius();
  } else {
    return 2;
  }
};

/** @inheritDoc */
DisplayConnector.prototype.getSimObjects = function() {
  return this.connector_ == null ? [ ] : [ this.connector_ ];
};

/** @inheritDoc */
DisplayConnector.prototype.getZIndex = function() {
  if (this.zIndex_ !== undefined) {
    return this.zIndex_;
  } else if (this.proto_ != null) {
    return this.proto_.getZIndex();
  } else {
    return 10;
  }
};

/** Color used when drawing this Connector, a CSS3 color value.
* @param {string|undefined} color
* @return {!DisplayConnector} this object for chaining setters
*/
DisplayConnector.prototype.setColor = function(color) {
  this.color_ = color;
  return this;
};

/** @inheritDoc */
DisplayConnector.prototype.setDragable = function(dragable) {
  // do nothing, connectors cannot be moved
};

/** @inheritDoc */
DisplayConnector.prototype.setPosition = function(position) {
  // do nothing, connectors cannot be moved
};

/** Radius of circle to draw, in screen coordinates.
* @param {number|undefined} value
* @return {!DisplayConnector} this object for chaining setters
*/
DisplayConnector.prototype.setRadius = function(value) {
  this.radius_ = value;
  return this;
};

/** @inheritDoc */
DisplayConnector.prototype.setZIndex = function(zIndex) {
  this.zIndex_ = zIndex;
};

});  // goog.scope
