// Google News API Key
// a4a03d7d0df7480e8b52461a0e39fb77
// Firebase API AIzaSyDYKhmDPqTGt1y52M1MI9VVnC0T6zXJML8

//uncaught exception: [DEFAULT]: Firebase: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app).
data = 0
currentArticle = 0
demo = 0  // will probably remove this later
let wpm = 500;

$(document).ready(function(){
  console.log("hello from savedarticle.js");
  getSavedArticles();
});

function getSavedArticles() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log(this.responseText);
    }
  };
  xhttp.open("GET", "/get-articles", true);
  xhttp.send();
}
