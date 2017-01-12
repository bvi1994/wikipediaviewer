function randomArticle(){
	location.href = 'https://en.wikipedia.org/wiki/Special:Random';
}

function getSearchTerm(){
	var term = $("#searchTerm").val(); 
	return term;
}

function getJson(term){
	var jsonURL = 'https://en.wikipedia.org/w/api.php?format=json&callback=?&action=query&generator=search&gsrnamespace=0&prop=extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' + term +'&prop=info|extracts&inprop=url';
	// Be sure to add the '&callback=?' because we are cross referencing'
	return jsonURL; 
}

function processJSON(jsonURL){
	$.getJSON(jsonURL, function(json){
		getInfo(json);
	});
}

function getInfo(json){
	var infoArray = [];
	if (json && json.query && json.query.pages){
		var pages = json.query.pages;
	} else {
		alert("Unable to process json");
		return;
	}
	for(var id in pages){
		var title = pages[id].title; // We will assign the current title to the variable title
		var url = pages[id].fullurl; //Get the page id
		var excerpt = pages[id].extract;
		var info = new information(title, url, excerpt);
		if(title){
			infoArray.push(info); // Push the current title into the array of titles
		} else { 
			alert('Unable retreive title');
			return;
		}
	}
	processInfo(infoArray);
	return;
}

function processInfo(info){
	var listLength = info.length;
//	return listLength;
	$(".searchResults").empty(); // Clear the contents of the last search result
	for(var i = 0; i < listLength; i++){
		//alert(titles[i]);
		$(".searchResults").append("<div class='searchResultBox' id='searchResult" + i + "'</div>");
		displayTitle(info[i].url, info[i].title, i);
		displayURL(info[i].url, i);
		displayExerpt(info[i].excerpt, i);
	}
	$(".searchResults").append(	"<div id='Credits1'>Created by <a href='https://www.linkedin.com/in/bvi1994'>Brandon Vi</a> for <a href='https://www.freecodecamp.com/challenges/build-a-wikipedia-viewer'>FreeCodeCamp</a></div>");
}

function displayTitle(titleURL, title, i){
	$("#searchResult" + i).append("<div class='title' id='title" + i + "'>"+ "<a href='" + titleURL + "' id='link" + i + "'>" + title + "</a></div>");
}

function displayURL(titleURL, i){
	$("#searchResult" + i).append("<div class='url' id='url" + i + "'>" + titleURL + "</div>");
}

function displayExerpt(excerpt, i){
	$("#searchResult" + i).append("<div class='extract' id='excerpt" + i + "'>" + excerpt + "</div>");
}

function information(title, url, excerpt){
	// Defines the data structure for each article being viewed
	this.title = title;
	this.url = url;
	this.excerpt = excerpt;
}

function search(){
	var searchTerm = getSearchTerm();
	var jsonURL = getJson(searchTerm);
	processJSON(jsonURL);
	moveElements();
}

function moveLogo(){
	$("#logo").removeClass('col-md-6');
	$("#logo").css({'font-size': '45px', 'position': 'absolute', 'top': '0', 'left': '-60%'});
}

function moveSearchBar(){
	$("#search").removeClass('col-md-6');
	$("#search").addClass('col-md-5');
	$('#search').css({'top': '3%', 'left': '12%', 'position': 'absolute'});
}

function displaySearch(){
	$('.searchResults').css({'top': '10%', 'position': 'absolute'});
	$('.buttons').removeClass('col-xs-1');
	$('#searchWiki').remove();
	$('#randomSearch').remove();
	$('#Credits').remove();
}

function moveElements(){
	moveLogo();
	moveSearchBar();
	displaySearch();
}

$(document).keypress(function (e) {
    if (e.which == 13) {
		var searchTerm = getSearchTerm();
		var jsonURL = getJson(searchTerm);
		processJSON(jsonURL);
		moveElements();
	}
});