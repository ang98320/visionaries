// Google News API Key
// a4a03d7d0df7480e8b52461a0e39fb77
// Firebase API AIzaSyDYKhmDPqTGt1y52M1MI9VVnC0T6zXJML8

//uncaught exception: [DEFAULT]: Firebase: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app).
data = 0
articles = 0
currentArticle = 0
demo = 0  // will probably remove this later
let wpm = 500;

$(document).ready(function(){
  console.log("hello from speedreader.js");
});

function getTrendingNews(callback) {
  var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=a4a03d7d0df7480e8b52461a0e39fb77';
  var req = new Request(url);
  fetch(req)
      .then(function(response) {
          //console.log(response.json());
          return response.json();
      })
      .then(function(json) {
        data = json
  //use variable articles from here on to access articles, as savedarticle.js doesn't need to use the data variable in its context
  articles = data.articles
        callback();
      })
}

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
     demo = this.responseText;
    }
  };
  xhttp.open("GET", "/demo-speedreader", true);
  xhttp.send();
}

function initReader(id) {
  console.log(id);
  currentArticle = id;
}

let speedreader = 0
//function readText(text) {
function startReader() {
  text = demo;

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