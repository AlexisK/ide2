define("ace/theme/tomorrow_darvix",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-tomorrow-darvix";
exports.cssText = ".ace-tomorrow-darvix .ace_gutter {\
background: #f6f6f6;\
color: #4D4D4C\
}\
.ace-tomorrow-darvix .ace_print-margin {\
width: 1px;\
background: #f6f6f6\
}\
.ace-tomorrow-darvix {\
background-color: #FFFFFF;\
color: #4D4D4C\
}\
.ace-tomorrow-darvix .ace_cursor {\
color: #AEAFAD\
}\
.ace-tomorrow-darvix .ace_marker-layer .ace_selection {\
background: #D6D6D6\
}\
.ace-tomorrow-darvix.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #FFFFFF;\
border-radius: 2px\
}\
.ace-tomorrow-darvix .ace_marker-layer .ace_step {\
background: rgb(255, 255, 0)\
}\
.ace-tomorrow-darvix .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #D1D1D1\
}\
.ace-tomorrow-darvix .ace_marker-layer .ace_active-line {\
background: #EFEFEF\
}\
.ace-tomorrow-darvix .ace_gutter-active-line {\
background-color : #dcdcdc\
}\
.ace-tomorrow-darvix .ace_marker-layer .ace_selected-word {\
border: 1px solid #D6D6D6\
}\
.ace-tomorrow-darvix .ace_invisible {\
color: #D1D1D1\
}\
.ace-tomorrow-darvix .ace_keyword,\
.ace-tomorrow-darvix .ace_meta,\
.ace-tomorrow-darvix .ace_storage,\
.ace-tomorrow-darvix .ace_storage.ace_type,\
.ace-tomorrow-darvix .ace_support.ace_type,\
.ace-tomorrow-darvix .ace_paren {\
color: #8959A8\
}\
.ace-tomorrow-darvix .ace_keyword.ace_operator {\
color: #3E999F\
}\
.ace-tomorrow-darvix .ace_constant.ace_character,\
.ace-tomorrow-darvix .ace_constant.ace_language,\
.ace-tomorrow-darvix .ace_constant.ace_numeric,\
.ace-tomorrow-darvix .ace_keyword.ace_other.ace_unit,\
.ace-tomorrow-darvix .ace_support.ace_constant {\
color: #718C00\
}\
.ace-tomorrow-darvix .ace_constant.ace_other {\
color: #666969\
}\
.ace-tomorrow-darvix .ace_invalid {\
color: #FFFFFF;\
background-color: #C82829\
}\
.ace-tomorrow-darvix .ace_invalid.ace_syntax {\
color: #111111;\
background-color: #FC9C1D\
}\
.ace-tomorrow-darvix .ace_invalid.ace_deprecated {\
color: #FFFFFF;\
background-color: #8959A8\
}\
.ace-tomorrow-darvix .ace_fold {\
background-color: #4271AE;\
border-color: #4D4D4C\
}\
.ace-tomorrow-darvix .ace_entity.ace_name.ace_function,\
.ace-tomorrow-darvix .ace_support.ace_function,\
.ace-tomorrow-darvix .ace_variable {\
color: #4271AE\
}\
.ace-tomorrow-darvix .ace_variable.ace_userdefined,\
.ace-tomorrow-darvix .ace_variable.ace_parameter,\
.ace-tomorrow-darvix .ace_keyword.ace_control {\
font-weight: bold\
}\
.ace-tomorrow-darvix .ace_variable.ace_userdefined.ace_pointer {\
font-style: italic\
}\
.ace-tomorrow-darvix .ace_support.ace_class,\
.ace-tomorrow-darvix .ace_support.ace_type {\
color: #C99E00\
}\
.ace-tomorrow-darvix .ace_heading,\
.ace-tomorrow-darvix .ace_markup.ace_heading,\
.ace-tomorrow-darvix .ace_string {\
color: #F5871F\
}\
.ace-tomorrow-darvix .ace_entity.ace_name.ace_tag,\
.ace-tomorrow-darvix .ace_entity.ace_other.ace_attribute-name,\
.ace-tomorrow-darvix .ace_meta.ace_tag,\
.ace-tomorrow-darvix .ace_string.ace_regexp,\
.ace-tomorrow-darvix .ace_variable.ace_language {\
color: #C82829\
}\
.ace-tomorrow-darvix .ace_comment {\
background-color: #4D4D4C;\
color: #f6f6f6\
}\
.ace-tomorrow-darvix .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bdu3f/BwAlfgctduB85QAAAABJRU5ErkJggg==) right repeat-y\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});

