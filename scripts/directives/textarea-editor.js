'use strict';
/*global calculoid */
calculoid.directive('texteditor', function() {
	var textEditor = {e: null, toolbars: {}, selection: null, onChangeTimeout: false};

	textEditor.toolbars.operators = {
		'class': 'btn-group pull-left',
		'plus':{
			'title':'+',
			'before':'+'
		},
		'minus':{
			'title':'-',
			'before':'-'
		},
		'multiply':{
			'title':'*',
			'before':'*'
		},
		'devide':{
			'title':'/',
			'before':'/'
		},
		'pow':{
			'title':'^',
			'before':'^'
		},
		'brackets':{
			'title':'()',
			'before':'(',
			'after':')'
		}
	};

	textEditor.toolbars.functions = {
		'class': 'btn-group btn-group-xs',
		'sin':{
			'title':'sin',
			'before':'sin(',
			'after':')'
		},
		'cos':{
			'title':'cos',
			'before':'cos(',
			'after':')'
		},
		'tan':{
			'title':'tan',
			'before':'tan(',
			'after':')'
		},
		'asin':{
			'title':'asin',
			'before':'asin(',
			'after':')'
		},
		'acos':{
			'title':'acos',
			'before':'acos(',
			'after':')'
		},
		'atan':{
			'title':'atan',
			'before':'atan(',
			'after':')'
		},
		'sqrt':{
			'title':'sqrt',
			'before':'sqrt(',
			'after':')'
		},
		'log':{
			'title':'log',
			'before':'log(',
			'after':')'
		},
		'abs':{
			'title':'abs',
			'before':'abs(',
			'after':')'
		},
		'ceil':{
			'title':'ceil',
			'before':'ceil(',
			'after':')'
		},
		'floor':{
			'title':'floor',
			'before':'floor(',
			'after':')'
		},
		'round':{
			'title':'round',
			'before':'round(',
			'after':')'
		},
		'exp':{
			'title':'exp',
			'before':'exp(',
			'after':')'
		},
		'pi':{
			'title':'Pi',
			'before':'3.14159265359'
		}
	};

	textEditor.setElement = function(element){
		this.e = element;
	};

	textEditor.getSelection = function(){
		if(!!document.selection) {
			return document.selection.createRange().text;
		}
		else if(!!this.e.setSelectionRange) {
			return this.e.value.substring(this.e.selectionStart,this.e.selectionEnd);
		}
		else {
			return false;
		}
	};

	textEditor.getCaretPosition = function(){
		var caretPostion = 0;
		if (document.selection) {
			this.e.focus ();
			var oSel = document.selection.createRange ();
			oSel.moveStart ('character', -this.e.value.length);
			caretPostion = oSel.text.length;
		}
		else if (this.e.selectionStart || this.e.selectionStart === '0'){
			caretPostion = this.e.selectionStart;
		}
		return (caretPostion);
	};

	textEditor.setCaretPosition = function (position) {
		this.e.selectionStart = position;
		this.e.selectionEnd = position;
		this.e.focus();
	};

	textEditor.replaceSelection = function(before, after, selection){
		if(typeof selection === 'undefined'){
			selection = '';
		}
		var text = before + selection + after;
		if(!!document.selection){
			this.e.focus();
			var range = document.selection.createRange();
			range.text = text;
			range.select();
		}else if(!!this.e.setSelectionRange){
			var selectionStart = this.e.selectionStart;
			this.e.value = this.e.value.substring(0,selectionStart) + text + this.e.value.substring(this.e.selectionEnd);
			this.e.setSelectionRange(selectionStart + text.length, selectionStart + text.length);
		}
		this.e.focus();
	};

	textEditor.wrapSelection = function(before, after){
		var selection = this.getSelection();
		this.replaceSelection(before, after, selection);
	};

	textEditor.insertIntoPosition = function(before, after) {
		this.replaceSelection(before, after);
	};

	textEditor.hasSelection = function () {
		if (this.e.selectionStart === this.e.selectionEnd) {
			return false;
		} else {
			return true;
		}
	};

	var generateTemplate = function(){
		// toolbar wrapper
		var template = '<div ng-repeat="toolbar in textEditorToolbars" class="textEditorToolbarWrapper {{toolbar.class}}">';
		
		// normal button
		template += '<button ng-if="button.title" data-textBefore="{{button.before}}" data-textAfter="{{button.after}}" type="button" ng-repeat="button in toolbar" onclick="surroundSelection(this);" class="btn btn-default {{button.class}}">';
		template += '<b>{{button.title}}</b>';
		template += '</button>';

		// end of toolbar wraper
		template += '</div><br />';

		// textarea itself
		template += '<div id="af-value" onfocusout="formula_update()" contenteditable="true" class="form-control">&nbsp;</div><div id="hidden-af-value" ng-model="activeField.value" ng-bind-html="activeField.value">&nbsp;</div>';
		return template;
	};

	return {
		template: generateTemplate(),
		link: function($scope, elem, attrs) {

			$scope.textEditorToolbars = textEditor.toolbars;
			$scope.textEditorRows = attrs.rows;
			$scope.textEditorCols = attrs.cols;
			
			var customToolbars = $scope.customTexteditorToolbars;

			angular.forEach(customToolbars, function(toolbar, toolbarName){
				$scope.textEditorToolbars[toolbarName] = toolbar;
			});

			var editor = document.getElementsByClassName("af-value")[0];
			var textarea = angular.element(editor)[0];
			var caretPosition = 0;
			textEditor.setElement(textarea);

			$scope.textEditorButtonClicked = function(button) {
				if(typeof button.before === 'undefined'){
					button.before = '';
				}
				if(typeof button.after === 'undefined'){
					button.after = '';
				}
				caretPosition = textEditor.getCaretPosition();

				if(textEditor.hasSelection()){
					textEditor.wrapSelection(button.before, button.after);
				}else{
					textEditor.insertIntoPosition(button.before, button.after);
				}

				// let angular know about value
				$scope.activeField.value = textarea.value;
			};
		}
	};
});
calculoid.controller('textEditorCtr', ['$scope', '$window', function($scope, $window) {
	$scope.memId = $window.memId;

	$scope.getMember = function(id) {
		console.log(id);
	};
}]);
