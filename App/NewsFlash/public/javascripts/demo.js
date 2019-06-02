// Google News API Key
// a4a03d7d0df7480e8b52461a0e39fb77
// Firebase API AIzaSyDYKhmDPqTGt1y52M1MI9VVnC0T6zXJML8

//uncaught exception: [DEFAULT]: Firebase: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app).
data = 0
articles = 0
currentArticle = 0
demo = 0  // will probably remove this later
let wpm = 500;

fonts = {
  "Helvetica Neue": 0,
  "Arial": 1,
  "Georgia": 2,
  "Verdana": 3,
  "Courier New": 4,
  "Lucida Console": 5,
  "Open Dyslexic": 6,
  "LexieReadable": 7
}

$(document).ready(function(){
  console.log("hello from demo.js");
  console.log(window.localStorage.font);
  setFont(window.localStorage.font);
});

function initReader(id) {
  console.log(id);
  currentArticle = id;
}

let speedreader = 0
function startReader() {
  //text = demo;
  text = $("#demoBox").val()
  if(text == null)
    text = "Article_Text_Not_Found!";
  //if a speedreader interval is already open, close it and start a new one
  if (speedreader)
  closeReader();

  let words = text.toString().split(" ");
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

function setFont(font) {
  $('#fontSelect')[0].selectedIndex=fonts[font];//.trigger("chosen:updated");
	$("*").css("font-family", font);
	console.log("font changed successful!");
}

function fontChange() {
  $(".container").css("font-family", $('#fontSelect').find(":selected").text());
  $("*").css("font-family", $('#fontSelect').find(":selected").text());
  console.log("changing font!");
  window.localStorage.font = $('#fontSelect').find(":selected").text();
  console.log(window.localStorage.font);
}
