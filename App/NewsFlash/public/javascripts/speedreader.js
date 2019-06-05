/*
* speedreader.js
* This is the backend for index.pug
* Upon successful loading of index.pug, this file calls the NewsApi to retrieve
* current articles. These current articles are then loaded into index.pug.
* There is also a save functionality which writes an article into firebase.
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
  console.log("hello from speedreader.js");
  getTrendingNews(function() {
    console.log("done");
    console.log(data.articles);
    loadNewsArticles(data.articles);
    console.log(window.localStorage.font);
    setFont(window.localStorage.font);
  });
});

// Gets the trending news from NewsAPI.org
function getTrendingNews(callback) {
  var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=a4a03d7d0df7480e8b52461a0e39fb77';
  var req = new Request(url);
  fetch(req)
      .then(function(response) {
          return response.json();
      })
      .then(function(json) {
        data = json
	articles = data.articles
        callback();
      })
}

// Loads the article's contents into jumbotrons to be shown on the main page
function loadNewsArticles(articles) {

  console.log("total articles: " + articles.length);
  for (var i = 0; i < 8; i++) {
    if (!articles[i].content) {
      console.log("article missing content");
      articles[i].content = articles[i].description;
    }
    if (!articles[i].author) {
      console.log("article author missing");
      articles[i].author = "Unknown Author";
    }
    if($("#jumbotron-"+i != null))
      $("#jumbotron-"+i).css("background-image", "url("+articles[i].urlToImage+")");
    else
      $("#jumbotron-"+i).css("background-image", "url(https://icdn2.digitaltrends.com/image/news-apps-header-1500x1000.jpg)");
    $("#jumbotron-"+i).attr("alt", articles[i].publishedAt);
    $("#title-"+i).html("<h1>"+articles[i].title+"</h1>");
    $("#article-"+i).html("<h2>"+articles[i].description+"</h2>");
    loadTimeToRead();
  }
}

// Loads the time to read into the jumbotron
function loadTimeToRead() {
  for (var i = 0; i < 8; i++) {
    $("#footer-"+i).html("<p>"+calcTimeToRead(articles[i])+"</p>");
  }
}

// Calculates the time to read for each article
function calcTimeToRead(article) {
  if(article.content)
    words = article.content.split(" ");
  else
    return "No content in this article...";
  let numWords = words.length - 1;
  let wpm = document.getElementById("wpm").value;
  console.log(wpm);
  if (wpm == "Infinity" || wpm == "") wpm = 120;
  const readTime = (numWords/wpm).toFixed(2);
  return (readTime + " minutes to read at "+wpm+" words per minute.");
}

// sets currentArticle with id (called when Read button is clicked in index.pug)
function initReader(id) {
  console.log(id);
  currentArticle = id;
}

// Starts speedreading article content of currentArticle (called when Start button in Modal is clicked in index.pug)
function startReader() {
  wpm = ((1/(document.getElementById("wpm").value/60))*1000);
  if (currentArticle == "article-button-demo") {
    text = document.getElementById("demoBox").value;
    console.log(text);
  } else {
    idx = currentArticle.replace('article-button-','');
    text = data.articles[idx].content;
  }

  if (text == null) text = data.articles[idx].description;
  if (speedreader) closeReader();

  let words = text.split(" ");
  let numWords = words.length - 1;
  let index = 0;

  if (wpm == "Infinity" || wpm == "") wpm = 500;

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

// Saves the article into Firebase when the save button is pressed
function saveArticle(article) {
  $.ajax({
    url: "/save-article",
    type: 'POST',
    data: JSON.stringify(article),
    processData: false,
    contentType: 'application/json'
  }).success(function (data) {
    console.log(data);
  });
}

// Prepares article to be saved
function save(id) {
  idx = id.replace('save-button','');
  article = {
    "author": data.articles[idx].author,
    "content": data.articles[idx].content,
    "description": data.articles[idx].description,
    "publishedAt": data.articles[idx].publishedAt,
    "title": data.articles[idx].title,
    "url": data.articles[idx].url,
    "urlToImage": data.articles[idx].urlToImage
  };
  if(document.getElementById(id).src.includes("empty.png")) {
    document.getElementById(id).src = "images/save_icon_fill.png";
    $("#"+id).after('<p id="success">Added article to Saved!</p>');
    $("#success").delay(2000).fadeOut();
    saveArticle(article);
  } else {
    document.getElementById(id).src = "images/save_icon_empty.png";
    $("#"+id).after('<p id="success">Removed article from Saved!</p>');
    $("#success").delay(2000).fadeOut();
  }
}

// Removes the saved article from Firebase
function removeArticle(id) {
  console.log("called removeArticle:", id);
  let idx = id.replace('jumbotron-','');
  console.log(data.articles[idx].title);
  article = {
    "key": data.articles[idx].publishedAt
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

// called to change page font after document is ready
function setFont(font) {
  $("*").css("font-family", font);
  console.log("font changed successful!");
}

//for testing purposes only
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

//for testing purposes only
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
