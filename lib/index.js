/**
 * @fileoverview plugin for fsd achitecture ,  contol  public api imports 
 * @author eslint-plugin-murahas-plugin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");



// import processors
module.exports.processors = {
  // add your processors here
};

