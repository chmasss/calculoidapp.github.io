var new_calc = false;
var new_calc_edit = false;
var editor_values = [];
var matches = [];
function bubbleSort(a) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if(a[i + 1]){
                if (a[i].length < a[i + 1].length) {
                    var temp = a[i];
                    a[i] = a[i + 1];
                    a[i + 1] = temp;
                    swapped = true;
                }
            }
        }
    } while (swapped);
}
function setCursorToEnd(ele)
{
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(ele, 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    ele.focus();
}
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}
function show_names_of_fields() {
    var scope = angular.element(document.querySelector("#editor-tools")).scope();
    var x = scope.calc.fields;
    var res = [];
    for(key in x) {
        res.push("F"+x[key].id+" = "+x[key].name);
    }
    return res;
}
function new_calc_alert() {
    if (new_calc == true) {
        document.getElementById('new_calc').style.display = 'block';
        new_calc = false;
    }
    if (new_calc_edit == true) {
        document.getElementById('calcLang').options[42].selected = true;
        new_calc_edit = false;
    }
}
function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if(strArray[j]){
            if (strArray[j].match(RegExp(str, 'g'))) return j;
        }
    }
    return -1;
}
function formula_update() {
    var lis = show_names_of_fields();
    bubbleSort(lis);
    var string = document.getElementById("af-value").innerHTML;
    matches = document.getElementById("af-value").innerHTML.match(/[F]\d+/g);
    var print = string;
    if (matches) {
        for (i = 0; i < matches.length; i++) {
            var ind = searchStringInArray(matches[i],lis);
            if(lis[ind]){
                editor_values.push(lis[ind]);
                //.replace(/ [\(]+ /g, "&nbsp;<div class='brackets'>(&nbsp;").replace(/ [\)]+ /g, "&nbsp;)</div>&nbsp;")
                print = print.replace(new RegExp(matches[i], 'g'), "<a contenteditable='false' class='textEditorBtn' onclick='deleteElement(this)'>"+lis[ind].split(" = ")[1]+"<span id='delete_it'></span></a>&nbsp;");
            }
        }
        document.getElementById("af-value").innerHTML = print;
    }
    var ang_val = document.getElementById("af-value").innerHTML.replace(/(<([^>]+)>)/ig,"");
    ang_val = ang_val.replace(/&nbsp;/ig,"").replace(/&amp;/ig,"&").replace(/&lt;/ig,"<").replace(/&gt;/ig,">");
    bubbleSort(editor_values);
    for (i = 0; i < editor_values.length; i++) {
        ang_val = ang_val.replace(new RegExp(editor_values[i].split(" = ")[1].replace(/[\+]+/g,'[\+]+').replace(/[^[\\+]\+]+[\[]+/g,'[\(]+').replace(/[^[\\+]\+]+[\]]+/g,'[\)]+').replace(/[\{]+/g,'[\(]+').replace(/[\}]+/g,'[\)]+').replace(/[\(]+/g,'[\(]+').replace(/[\)]+/g,'[\)]+').replace(/[\?]+/g,'[\?]+').replace(/[\*]+/g,'[\*]+').replace(/[\$]+/g,'[\$]+').replace(/[\^]+/g,'[\^]+').replace(/[\,]+/g,'[\,]+').replace(/[\!]+/g,'[\!]+').replace(/[\|]+/g,'[\|]+').replace(/[\�]+/g,'[\�]+').replace(/[\']+/g,'[\']+').replace(/[\;]+/g,'[\;]+').replace(/[\%]+/g,'[\%]+').replace(/[\-]+/g,'[\-]+').replace(/[\.]+/g,'[\.]+'), 'gi'), editor_values[i].split(" = ")[0]);
    }
    var scope = angular.element(document.querySelector("#editor-tools")).scope();
    scope.activeField.value = ang_val;
}
function surroundSelection(this_btn) {
    document.getElementById("af-value").focus();
    surroundSelectionWork(this_btn.getAttribute("data-textBefore"), this_btn.getAttribute("data-textAfter"))
}
function surroundSelectionWork(textBefore, textAfter) {
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount > 0) {
            var range = sel.getRangeAt(0);
            var startNode = range.startContainer, startOffset = range.startOffset;
            var boundaryRange = range.cloneRange();
            var startTextNode = document.createTextNode(textBefore);
            var endTextNode = document.createTextNode(textAfter);
            boundaryRange.collapse(false);
            boundaryRange.insertNode(endTextNode);
            boundaryRange.setStart(startNode, startOffset);
            boundaryRange.collapse(true);
            boundaryRange.insertNode(startTextNode);

            formula_update();
            placeCaretAtEnd(document.getElementById("af-value"));
        }
    }
}
function formula_start() {
    document.getElementById("af-value").innerHTML = document.getElementById("hidden-af-value").innerHTML;
    document.getElementsByClassName("textEditorToolbarWrapper btn-field-ids")[0].innerHTML = document.getElementsByClassName("textEditorToolbarWrapper btn-field-ids")[0].innerHTML.replace(/[F]\d+ = /g, "");
    if (document.getElementById("af-value").innerHTML === ""){
        document.getElementById("af-value").innerHTML = "&nbsp;";
    }
    formula_update();
    setCursorToEnd($('#af-value').get(0));
}
function deleteElement(n){
    n.parentNode.removeChild(n);
}
function checkURL (a) {
    var string = a.value;
    if ((!~string.indexOf("http"))&&(string!="")) {
        string = "http://" + string;
    }
    a.value = string;
    return a
}
function removeAttr() {
    $(".edit-field-body .nav-pills a").removeAttr("href");
    setTimeout(removeAttr, 1000);
}
removeAttr();