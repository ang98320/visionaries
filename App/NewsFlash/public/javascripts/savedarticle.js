/*
* savedarticle.js
* This is the backend for saved.pug
* Upon successful loading of saved.pug, this file calls a routing function
* in app.js to get saved articles from firebase. These saved articles are then loaded
* into saved.pug with dynamic div creation.
* There is also a remove functionality which deletes saved articles from firebase.
* This file is also capable of loading a speedreader.
* This file is also capable of setting WPM.
*/

let data = 0;
let articles = 0;
let currentArticle = 0;
let demo = 0;
let wpm = 500;
let speedreader = 0;

$(document).ready(function(){
  console.log("hello from savedarticle.js");
  getSavedArticles();
});

// Loads the saved articles from Firebase
function getSavedArticles() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     articles = JSON.parse(this.responseText);
     updateUI(JSON.parse(this.responseText));
    }
  };
  xhttp.open("GET", "/get-articles", true);
  xhttp.send();
}

// Removes a saved article from Firebase
function removeArticle(id) {
  console.log("called removeArticle:", id);
  let idx = id.replace('jumbotron-','');
  console.log(articles[idx].title);
  article = {
    "key": articles[idx].publishedAt
  }

  $.ajax({
    url: "/remove-article",
    type: 'POST',
    data: JSON.stringify(article),
    processData: false,
    contentType: 'application/json'
  }).success(function (data) {
    console.log(data);
    $('#'+id).remove();
  });
}

// Fills the page with article jumbotrons
function updateUI(articles) {
  for (var i = 0; i < articles.length; i ++) {
    console.log(articles[i]);
    var jumbotron = createArticleJumbotron(articles[i], i);
    var html = document.getElementById("saved-content").appendChild(jumbotron);
  }
  console.log(window.localStorage.font);
  setFont(window.localStorage.font)
  loadTimeToRead(articles);
}

// Creates a article jumbotrons given a saved articles
function createArticleJumbotron(article, i) {
  var ul = document.createElement("ul")
  ul.className = "articleItems";

  var title = document.createElement("h1")
  title.innerHTML = article.title;
  var div1 = document.createElement("div")
  div1.className="line";
  var desc = document.createElement("h2")
  desc.className="description";
  desc.innerHTML = article.description;
  var div2 = document.createElement("div")
  div2.className="line";
  var footer = document.createElement("p")
  footer.className="footer"
  footer.id = "footer-"+i
  var list = document.createElement("li")
  var read = document.createElement("a.btn.btn-lg.btn-primary")
  read.id = "article-button-"+i
  read.className = "btn btn-lg btn-primary btn btn-default";
  read.innerHTML = "Read"
  read.setAttribute('href',"#normalModal");
  read.setAttribute('data-toggle',"modal");
  read.onclick= function() {
    initReader(i);
  };

  var del = document.createElement("a.btn.btn-lg.btn-primary")
  del.className = "btn btn-lg btn-primary btn btn-default removeButton";
  del.innerHTML = "Remove"
  del.onclick=function() {
    removeArticle('jumbotron-'+i);
  }

  list.append(read);
  list.append(del)

  ul.append(title);
  ul.append(div1);
  ul.append(desc);
  ul.append(div2);
  ul.append(footer);
  ul.append(list);

  var jumbotron = document.createElement("div");
  jumbotron.id = "jumbotron-"+i
  jumbotron.style = "padding:20px;";
  jumbotron.style.backgroundImage = "url("+article.urlToImage+")";
  jumbotron.className = "jumbotron";
  jumbotron.append(ul);
  return jumbotron;
}

// Loads the time to read each article into the jumbotron
function loadTimeToRead(articles) {
  for (var i = 0; i < articles.length; i++) {
    $("#footer-"+i).html("<p>"+calcTimeToRead(articles[i])+"</p>");
  }
}


// Helper method that calculates the time to read for use in loadtimetoread(articles)
function calcTimeToRead(article) {
  if(article.content)
    words = article.content.split(" ");
  else
    return "No content in this article...";
  let numWords = words.length - 1;
  let wpm = document.getElementById("wpm").value;

  console.log(wpm);
  if(wpm == "Infinity" || wpm == "") wpm = 120;
  const readTime = (numWords/wpm).toFixed(2);
  return (readTime + " minutes to read at "+wpm+" words per minute.");
}

// sets currentArticle with id (called when Read button is clicked in saved.pug)
function initReader(id) {
  console.log("initReader", id);
  currentArticle = id;
}

// Starts speedreading article content of currentArticle (called when Start button in Modal is clicked in saved.pug)
function startReader() {
  wpm = ((1/(document.getElementById("wpm").value/60))*1000);
  if (currentArticle == "article-button-demo") {
    text = document.getElementById("demoBox").value;
    console.log(text);
  } else {
    idx = currentArticle;
    console.log(articles[idx]);
    text = articles[idx].content;
  }

  if(text == null) text = "Article_Text_Not_Found!";
  if (speedreader) closeReader();

  let words = text.split(" ");
  let numWords = words.length - 1;
  let index = 0;

  if(wpm == "Infinity" || wpm == "") wpm = 500;

  speedreader = setInterval(function(){
    if (words[index] != null) {
      $("#test_area").html("<h4>"+words[index]+"</h4>");
      index+=1;
    }
  }, wpm);
}

// Closes the speed reader
function closeReader() {
  console.log("closing reader");
  $("#test_area").html("<h3></h3>");
  clearInterval(speedreader);
}

// called to change page font after document is ready
function setFont(font) {
  $("*").css("font-family", font);
  console.log("font changed successful!");
}
