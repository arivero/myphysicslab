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

goog.provide('myphysicslab.lab.controls.ChoiceControl');

goog.require('myphysicslab.lab.controls.ChoiceControlBase');
goog.require('myphysicslab.lab.util.Observer');
goog.require('myphysicslab.lab.util.Parameter');
goog.require('myphysicslab.lab.util.Util');

goog.scope(function() {

var ChoiceControlBase = myphysicslab.lab.controls.ChoiceControlBase;
var Parameter = myphysicslab.lab.util.Parameter;
var Util = myphysicslab.lab.util.Util;

/** A pop-up menu which synchronizes its state with the {@link Parameter} of a
{@link myphysicslab.lab.util.Subject Subject}.

When the value of the ChoiceControl is changed, the Parameter's value is changed
accordingly and therefore the Subject broadcasts the Parameter's value to all its
Observers.

ChoiceControl extends {@link ChoiceControlBase}, which has getter and setter functions
that operate on strings. Therefore the getter and setter functions used here are
{@link Parameter#getAsString} and {@link Parameter#setFromString}.

Choices and Values
------------------
If the choices and values are not specified as arguments to the constructor, then the
choices and values of the Parameter are used, see {@link Parameter#getChoices} and
{@link Parameter#getValues}.

If the choices and values *are* specified as arguments to the constructor, those will
override the choices and values of the Parameter.


How to Represent an Enum
------------------------
See {@link myphysicslab.lab.util.ParameterString} for information about how to set up a
ParameterString that represents a string enum. See
{@link myphysicslab.lab.util.ParameterNumber} for how to set up a ParameterNumber that
represents a numeric enum.


@param {!Parameter} parameter the parameter to modify
@param {?string=} opt_label the text label to show besides this choice, or `null` or
    empty string for no label.  If `undefined`, then the Parameter's name is used.
@param {!Array<string>=} opt_choices an array of localized strings giving the names
    of the menu items; if not specified, then the Parameter's choices are used.
@param {!Array<string>=} opt_values array of values corresponding to the choices;
    if not specified, then the Parameter's values are used.
@constructor
@final
@struct
@extends {ChoiceControlBase}
*/
myphysicslab.lab.controls.ChoiceControl = function(parameter, opt_label, opt_choices,
    opt_values) {
  /**
  * @type {!Parameter}
  * @private
  */
  this.parameter_ = parameter;
  var choices = opt_choices !== undefined ? opt_choices : parameter.getChoices();
  var values = opt_values !== undefined ? opt_values : parameter.getValues();
  var label = opt_label !== undefined ?
      opt_label : parameter.getName(/*localized=*/true);
  ChoiceControlBase.call(this, choices, values,
      goog.bind(parameter.getAsString, parameter),
      goog.bind(parameter.setFromString, parameter),
      label);
  this.parameter_.getSubject().addObserver(this);
};

var ChoiceControl = myphysicslab.lab.controls.ChoiceControl;
goog.inherits(ChoiceControl, ChoiceControlBase);

if (!Util.ADVANCED) {
  /** @inheritDoc */
  ChoiceControl.prototype.toString = function() {
    return ChoiceControl.superClass_.toString.call(this).slice(0, -1)
        + ', parameter_: '+this.parameter_.toStringShort()+'}';
  };
}

/** @inheritDoc */
ChoiceControl.prototype.disconnect = function() {
  ChoiceControl.superClass_.disconnect.call(this);
  this.parameter_.getSubject().removeObserver(this);
};

/** @inheritDoc */
ChoiceControl.prototype.getClassName = function() {
  return 'ChoiceControl';
};

/** @inheritDoc */
ChoiceControl.prototype.getParameter = function() {
  return this.parameter_;
};

/** @inheritDoc */
ChoiceControl.prototype.observe =  function(event) {
  if (event.getValue() == this.parameter_
      && event.nameEquals(Parameter.CHOICES_MODIFIED)) {
    // For performance reasons: delay rebuilding the menu for cases when many changes
    // are happening at once. To avoid rebuilding the menu each time, we wait 50ms;
    // then likely all the changes have occurred
    // and the first of these to fire will rebuild the menu correctly;
    // the later ones to fire will see that the current menu matches the Parameter
    // choices and do nothing.
    // Example: adding several bodies by calling RigidBodySim.addBody().
    // That results in VarsList.addVariables() broadcasting VARS_MODIFIED event each
    // time a body is added.
    setTimeout(goog.bind(this.rebuildMenu, this), 50);
  } else if (event == this.parameter_) {
    // only update when this parameter has changed
    ChoiceControl.superClass_.observe.call(this, event);
  }
};

/** Rebuild menu to match Parameter's set of choices and values
* @return {undefined}
* @private
*/
ChoiceControl.prototype.rebuildMenu = function() {
  var newChoices = this.parameter_.getChoices();
  // Does the current menu match the current set of choices?  If so, do nothing.
  if (!goog.array.equals(this.choices, newChoices)) {
    this.setChoices(newChoices, this.parameter_.getValues());
  }
};

}); // goog.scope
