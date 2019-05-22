// Google News API Key
// a4a03d7d0df7480e8b52461a0e39fb77
// Firebase API AIzaSyDYKhmDPqTGt1y52M1MI9VVnC0T6zXJML8

//uncaught exception: [DEFAULT]: Firebase: No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app).
data = 0
currentArticle = 0
demo = 0  // will probably remove this later
//let wpm = 500; (already declared in speedreader.js)

$(document).ready(function(){
  console.log("hello from savedarticle.js");
  getSavedArticles();
});

function getSavedArticles() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     //console.log(this.responseText);
     updateUI(JSON.parse(this.responseText));
    }
  };
  xhttp.open("GET", "/get-articles", true);
  xhttp.send();
}

function removeArticle() {
  //go up 3 levels to div parent class, pull index, remove this index from firebase
  // parent levels should go from button .> li -> ul -> div
  let altKey = $(this).parent().parent().parent().attr("alt");
  $.ajax({
    url: "/remove-article",
    type: 'DELETE',
    data: altKey,
    processData: false,
    contentType: 'application/json'
  }).success(function (data) {
    console.log(data);
  });

  $(".removeButton").click(function(event) {
    event.preventDefault();
    $(this).closest('.jumbotron').remove();
  });
  //figure out how to readjust every other jumbotron in the case that user would lke to remove
  //multiple articles.

}

function updateUI(articles) {
  
  loadNewsArticles(articles);	
  
  /*for (var i = 0; i < articles.length; i ++) {
    console.log(articles[i]);
    var jumbotron = createArticleJumbotron(articles[i], i);
    var html = document.getElementById("saved-content").appendChild(jumbotron);
    
  }*/
}

/*
function createArticleJumbotron(article, i) {
  var ul = document.createElement("ul")
  ul.className = "articleItems";

  var title = document.createElement("h1")
  title.innerHTML = article.title;
  var div1 = document.createElement("div")
  var desc = document.createElement("h2")
  desc.innerHTML = article.description;
  var div2 = document.createElement("div")
  var footer = document.createElement("p")
  var list = document.createElement("li")
  var read = document.createElement("a.btn.btn-lg.btn-primary")
  read.className = "btn btn-default";
  read.innerHTML = "Read"

  //var save = document.createElement("img.btn.btn-primary");

  list.append(read);

  ul.append(title);
  ul.append(div1);
  ul.append(desc);
  ul.append(div2);
  ul.append(footer);
  ul.append(list);

  var jumbotron = document.createElement("div");
  jumbotron.id = "jumbotron-"+i
  jumbotron.style.backgroundImage = "url("+article.urlToImage+")";
  jumbotron.className = "jumbotron";
  jumbotron.append(ul);
  return jumbotron;
}
*/
