//uncaught exception: [DEFAULT]: Firebase: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app).
text = 0
articles = 0
currentArticle = 0
let wpm = 500;

$(document).ready(function() {
  console.log("hello from speedreaderdemo.js");
  });

function demoSave() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("GET", "/demo-save", true);
  xhttp.send();
}

function demoAjax() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     currentArticle = "article-button-demo";
     text = this.responseText;
     console.log(text);
    }
  };
  xhttp.open("GET", "/demo-speedreader", true);
  xhttp.send();
}

let speedreader = 0
//function readText(text) {
function startReader() {
  if(text == null)
    text = "Article_Text_Not_Found!";
  //if a speedreader interval is already open, close it and start a new one
  if (speedreader)
	closeReader();

  console.log(text);
  let words = text.split(" ");
  let numWords = words.length - 1;
  let index = 0;

  if(wpm == "Infinity" || wpm == "")
    wpm = 500;

  //Open a new interval with speed (ms) based on wpm input
  speedreader = setInterval(function(){
    if (words[index] != null) {
      $("#test_area").html("<h4>"+words[index]+"</h4>");
      index+=1;
    }
  }, wpm);
}

function closeReader() {
  $("#test_area").html("<h3></h3>");
  clearInterval(speedreader);
}