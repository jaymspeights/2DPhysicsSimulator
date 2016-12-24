'use strict'
var control;
var dev;
var select;

window.onload = function(){
 control = document.getElementById("control_h2");
 dev = document.getElementById("dev_h2");
 select = document.getElementById("select_h2");

  control.addEventListener("click", function(event){
    var node = document.getElementById("control_div").style;
    if(node.display == "none") node.display = "block";
    else node.display = "none";
  }, false);

  dev.addEventListener("click", function(event){
    var node = document.getElementById("dev_div").style;
    if(node.display == "none") node.display = "block";
    else node.display = "none";
  }, false);

  select.addEventListener("click", function(event){
    var node = document.getElementById("select_div").style;
    if(node.display == "none") node.display = "block";
    else node.display = "none";
  }, false);

  start();
}
