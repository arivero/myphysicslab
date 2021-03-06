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

goog.provide('myphysicslab.sims.roller.RollerSingleApp');

goog.require('myphysicslab.lab.controls.ChoiceControl');
goog.require('myphysicslab.lab.controls.NumericControl');
goog.require('myphysicslab.lab.controls.TextControl');
goog.require('myphysicslab.lab.model.ParametricPath');
goog.require('myphysicslab.lab.model.PointMass');
goog.require('myphysicslab.lab.model.SimpleAdvance');
goog.require('myphysicslab.lab.util.DoubleRect');
goog.require('myphysicslab.lab.util.Observer');
goog.require('myphysicslab.lab.util.ParameterBoolean');
goog.require('myphysicslab.lab.util.ParameterNumber');
goog.require('myphysicslab.lab.util.ParameterString');
goog.require('myphysicslab.lab.util.Util');
goog.require('myphysicslab.lab.util.Vector');
goog.require('myphysicslab.lab.view.DisplayShape');
goog.require('myphysicslab.sims.common.AbstractApp');
goog.require('myphysicslab.sims.common.CommonControls');
goog.require('myphysicslab.sims.common.TabLayout');
goog.require('myphysicslab.sims.roller.CardioidPath');
goog.require('myphysicslab.sims.roller.CirclePath');
goog.require('myphysicslab.sims.roller.CustomPath');
goog.require('myphysicslab.sims.roller.FlatPath');
goog.require('myphysicslab.sims.roller.HumpPath');
goog.require('myphysicslab.sims.roller.LemniscatePath');
goog.require('myphysicslab.sims.roller.LoopTheLoopPath');
goog.require('myphysicslab.sims.roller.OvalPath');
goog.require('myphysicslab.sims.roller.PathObserver');
goog.require('myphysicslab.sims.roller.PathSelector');
goog.require('myphysicslab.sims.roller.RollerSingleSim');
goog.require('myphysicslab.sims.roller.SpiralPath');

goog.scope(function() {

var lab = myphysicslab.lab;
var sims = myphysicslab.sims;

var AbstractApp = sims.common.AbstractApp;
var CardioidPath = sims.roller.CardioidPath;
var ChoiceControl = lab.controls.ChoiceControl;
var CirclePath = sims.roller.CirclePath;
var CommonControls = sims.common.CommonControls;
var CustomPath = sims.roller.CustomPath;
var DisplayShape = lab.view.DisplayShape;
var DoubleRect = lab.util.DoubleRect;
var FlatPath = sims.roller.FlatPath;
var HumpPath = sims.roller.HumpPath;
var LemniscatePath = sims.roller.LemniscatePath;
var LoopTheLoopPath = sims.roller.LoopTheLoopPath;
var NumericControl = lab.controls.NumericControl;
var Observer = lab.util.Observer;
var OvalPath = sims.roller.OvalPath;
var ParameterBoolean = lab.util.ParameterBoolean;
var ParameterNumber = lab.util.ParameterNumber;
var ParameterString = lab.util.ParameterString;
var ParametricPath = lab.model.ParametricPath;
var PathObserver = sims.roller.PathObserver;
var PathSelector = sims.roller.PathSelector;
var PointMass = lab.model.PointMass;
var RollerSingleSim = sims.roller.RollerSingleSim;
var SimpleAdvance = lab.model.SimpleAdvance;
var SpiralPath = sims.roller.SpiralPath;
var TabLayout = sims.common.TabLayout;
var TextControl = lab.controls.TextControl;
var Util = lab.util.Util;
var Vector = lab.util.Vector;

/** Creates the RollerSingleSim simulation with no spring.

* @param {!TabLayout.elementIds} elem_ids specifies the names of the HTML
*    elementId's to look for in the HTML document; these elements are where the user
*    interface of the simulation is created.
* @constructor
* @final
* @extends {AbstractApp}
* @implements {Observer}
* @struct
* @export
*/
myphysicslab.sims.roller.RollerSingleApp = function(elem_ids) {
  Util.setErrorHandler();
  var simRect = new DoubleRect(-6, -6, 6, 6);
  var sim = new RollerSingleSim();
  var advance = new SimpleAdvance(sim);
  AbstractApp.call(this, elem_ids, simRect, sim, advance, /*eventHandler=*/sim,
      /*energySystem=*/sim);
  this.layout.simCanvas.setBackground('white');
  this.layout.simCanvas.setAlpha(CommonControls.SHORT_TRAILS);

  /** @type {!DisplayShape} */
  this.ball1 = new DisplayShape(this.simList.getPointMass('ball1'))
      .setFillStyle('blue');
  this.displayList.add(this.ball1);
  // allow the 't' variable to appear in expressions for X and Y equations
  this.terminal.addWhiteList('t');
  /** @type {!CustomPath} */
  this.customPath_ = new CustomPath();
  /** @type {!Array<!ParametricPath>} **/
  this.paths = [
      new HumpPath(),
      new LoopTheLoopPath(),
      new CirclePath(3.0),
      new OvalPath(),
      new LemniscatePath(2.0),
      new CardioidPath(3.0),
      new SpiralPath(),
      new FlatPath(),
      this.customPath_
  ];
  /** @type {!PathSelector} */
  this.pathSelect = new PathSelector(sim, this.paths);
  /** @type {!PathObserver} */
  this.pathObserver = new PathObserver(this.simList, this.simView,
      goog.bind(this.setSimRect, this));
  this.pathSelect.setPathName(HumpPath.en.NAME);

  this.addPlaybackControls();
  /** @type {!ParameterNumber} */
  var pn;
  /** @type {!ParameterString} */
  var ps;
  ps = this.pathSelect.getParameterString(PathSelector.en.PATH);
  this.addControl(new ChoiceControl(ps));
  pn = sim.getParameterNumber(RollerSingleSim.en.GRAVITY);
  this.addControl(new NumericControl(pn));
  pn = sim.getParameterNumber(RollerSingleSim.en.DAMPING);
  this.addControl(new NumericControl(pn));
  pn = sim.getParameterNumber(RollerSingleSim.en.MASS);
  this.addControl(new NumericControl(pn));

  this.addParameter(ps = new ParameterString(this, RollerSingleApp.en.EQUATION_X,
      RollerSingleApp.i18n.EQUATION_X,
      goog.bind(this.getXEquation, this), goog.bind(this.setXEquation, this))
      .setSuggestedLength(30));
  this.addControl(new TextControl(ps));
  this.addParameter(ps = new ParameterString(this, RollerSingleApp.en.EQUATION_Y,
      RollerSingleApp.i18n.EQUATION_Y,
      goog.bind(this.getYEquation, this), goog.bind(this.setYEquation, this))
      .setSuggestedLength(30));
  this.addControl(new TextControl(ps));
  this.addParameter(pn = new ParameterNumber(this, RollerSingleApp.en.START_T_VALUE,
      RollerSingleApp.i18n.START_T_VALUE,
      goog.bind(this.getStartTValue, this), goog.bind(this.setStartTValue, this))
      .setLowerLimit(Util.NEGATIVE_INFINITY));
  this.addControl(new NumericControl(pn));
  this.addParameter(pn = new ParameterNumber(this, RollerSingleApp.en.FINISH_T_VALUE,
      RollerSingleApp.i18n.FINISH_T_VALUE,
      goog.bind(this.getFinishTValue, this), goog.bind(this.setFinishTValue, this))
      .setLowerLimit(Util.NEGATIVE_INFINITY));
  this.addControl(new NumericControl(pn));

  this.addStandardControls();

  this.graph.line.setXVariable(0);
  this.graph.line.setYVariable(1);
  this.timeGraph.line1.setYVariable(0);
  this.timeGraph.line2.setYVariable(1);

  this.makeEasyScript();
  this.addURLScriptButton();
  this.pathSelect.addObserver(this);
};
var RollerSingleApp = myphysicslab.sims.roller.RollerSingleApp;
goog.inherits(RollerSingleApp, AbstractApp);

if (!Util.ADVANCED) {
  /** @inheritDoc */
  RollerSingleApp.prototype.toString = function() {
    return this.toStringShort().slice(0, -1)
        +', ball1: '+this.ball1.toStringShort()
        +', pathSelect: '+this.pathSelect.toStringShort()
        +', paths: [ '+this.paths+' ]'
        + RollerSingleApp.superClass_.toString.call(this);
  };
};

/** @inheritDoc */
RollerSingleApp.prototype.getClassName = function() {
  return 'RollerSingleApp';
};

/** @inheritDoc */
RollerSingleApp.prototype.defineNames = function(myName) {
  RollerSingleApp.superClass_.defineNames.call(this, myName);
  this.terminal.addRegex('ball1|paths|pathSelect',
      myName);
};

/** The ending value for `t` in the parameteric equation defining the path.
* @return {number} ending value for `t`
*/
RollerSingleApp.prototype.getFinishTValue = function() {
  return this.customPath_.getFinishTValue();
};

/** The starting value for `t` in the parameteric equation defining the path.
* @return {number} starting value for `t`
*/
RollerSingleApp.prototype.getStartTValue = function() {
  return this.customPath_.getStartTValue();
};

/** The ending value for `t` in the parameteric equation defining the path.
* @param {number} value ending value for `t`
*/
RollerSingleApp.prototype.setFinishTValue = function(value) {
  this.customPath_.setFinishTValue(value);
  this.pathSelect.setPathName(this.customPath_.getName());
  this.pathSelect.update();
  this.broadcastParameter(RollerSingleApp.en.FINISH_T_VALUE);
};

/** The starting value for `t` in the parameteric equation defining the path.
* @param {number} value starting value for `t`
*/
RollerSingleApp.prototype.setStartTValue = function(value) {
  this.customPath_.setStartTValue(value);
  this.pathSelect.setPathName(this.customPath_.getName());
  this.pathSelect.update();
  this.broadcastParameter(RollerSingleApp.en.START_T_VALUE);
};

/** @inheritDoc */
RollerSingleApp.prototype.getSubjects = function() {
  var subjects = RollerSingleApp.superClass_.getSubjects.call(this);
  return goog.array.concat(this.pathSelect, subjects);
};

/** Returns the parameteric X equation defining the path.
* @return {string} the parameteric X equation defining the path
*/
RollerSingleApp.prototype.getXEquation = function() {
  return this.customPath_.getXEquation();
};

/** Returns the parameteric Y equation defining the path.
* @return {string} the parameteric Y equation defining the path
*/
RollerSingleApp.prototype.getYEquation = function() {
  return this.customPath_.getYEquation();
};

/** Sets the parametric X equation defining the path. A JavaScript expression where
the parameter is `t`.
* @param {string} value the parameteric X equation defining the path
*/
RollerSingleApp.prototype.setXEquation = function(value) {
  // test this by entering equation like: 'window'
  this.terminal.vetBrackets(value);
  this.terminal.vetCommand(value);
  var oldValue = this.getXEquation();
  try {
    // test this by entering equations like: '3/0' or 'Math.log(-t)'.
    this.customPath_.setXEquation(value);
    this.pathSelect.setPathName(this.customPath_.getName());
    this.pathSelect.update();
    this.broadcastParameter(RollerSingleApp.en.EQUATION_X);
  } catch(ex) {
    // restore the old X-equation
    this.customPath_.setXEquation(oldValue);
    this.pathSelect.update();
    throw ex;
  }
};

/** Sets the parametric Y equation defining the path. A JavaScript expression where
the parameter is `t`.
* @param {string} value the parameteric Y equation defining the path
*/
RollerSingleApp.prototype.setYEquation = function(value) {
  this.terminal.vetBrackets(value);
  this.terminal.vetCommand(value);
  var oldValue = this.getYEquation();
  try {
    this.customPath_.setYEquation(value);
    this.pathSelect.setPathName(this.customPath_.getName());
    this.pathSelect.update();
    this.broadcastParameter(RollerSingleApp.en.EQUATION_Y);
  } catch(ex) {
    // restore the old Y-equation
    this.customPath_.setYEquation(oldValue);
    this.pathSelect.update();
    throw ex;
  }
};

/** @inheritDoc */
RollerSingleApp.prototype.observe =  function(event) {
  if (event.getSubject() == this.pathSelect) {
    this.easyScript.update();
    this.sim.modifyObjects();
  }
};

/**
@param {!DoubleRect} simRect
*/
RollerSingleApp.prototype.setSimRect = function(simRect) {
  this.simRect = simRect;
  this.simView.setSimRect(simRect);
};

/** Set of internationalized strings.
@typedef {{
  EQUATION_X: string,
  EQUATION_Y: string,
  START_T_VALUE: string,
  FINISH_T_VALUE: string
  }}
*/
RollerSingleApp.i18n_strings;

/**
@type {RollerSingleApp.i18n_strings}
*/
RollerSingleApp.en = {
  EQUATION_X: 'X-equation',
  EQUATION_Y: 'Y-equation',
  START_T_VALUE: 'start-t',
  FINISH_T_VALUE: 'finish-t'
};

/**
@private
@type {RollerSingleApp.i18n_strings}
*/
RollerSingleApp.de_strings = {
  EQUATION_X: 'X-Gleichung',
  EQUATION_Y: 'Y-Gleichung',
  START_T_VALUE: 'anfangs-t',
  FINISH_T_VALUE: 'ende-t'
};


/** Set of internationalized strings.
@type {RollerSingleApp.i18n_strings}
*/
RollerSingleApp.i18n = goog.LOCALE === 'de' ? RollerSingleApp.de_strings :
    RollerSingleApp.en;

}); // goog.scope
