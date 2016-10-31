// -----------------------------------------------------------------------
// This is a test file that illustrates how to use elasticlunr.js to
// index a set of documents and search the index 
//
// This program indexes a JSONified USA Constitution corpus chopped up
// by Articles and Amendments.
//
// You type in your search term and it prints the array of JSON objects
// that are returned from the search of the index.  For example:
//
//    |
//    | > type in your search term:
//    | race [ENTER]
//    | {"ref":"Amendment 15","score":0.7574399098951771}
//    |
//
// -----------------------------------------------------------------------

// add in the module for accessing the local filesystem
//    npm install fs --save
var fs = require('fs');

// add in the module for elasticlunr
// - elastic lunr is written by a non-native English speaker
// - however the scoring system DOES make more sense
//      npm install elasticlunr --save
var lunr = require('elasticlunr');

var index = null;

// Load the index from a serialized file
try
{
	index = lunr.load(fs.readFileSync("index.json"));
}
catch( err ) // if I can't load the file
{
	// load up the JSON corpus that we will index
	//    https://gist.github.com/howchmo/8cec899ff1c33155674498cfdfd0919a
	var constitution =  null;
	try
	{
		var constitution = JSON.parse(fs.readFileSync("usa_constitution.json"));
	}
	catch( err )
	{
		console.log("problem loading the constitution JSON file");
		process.exit();
	}

	// now generate the index variable
	// - note that "title" and "text" are JSON keys within 
	//   'consititution.json'
	// - we set the boost levels to favor 'title' over 'text'
	// - our reference to any document is defined as the 'title'
	//   with the JSON
	index = lunr(
		function ()
		{
			this.addField('title', {boost: 2});
			this.addField('text', {boost: 1});
			this.setRef('title');
	});


	// Iterate through the documents
	// - The constitution is one document, but the JSON chops it up
	//   by Article and Amendment and treats each of those as separate
	//   documents within the index.  This allows for us to reference
	//   sections of the document for search.
	for( var key in constitution )
		index.addDoc(constitution[key]);

	fs.writeFile("index.json", JSON.stringify(index));
}

// Check to make sure the index is not null
if( index != null )
{
	console.log();

	console.log("> type in your search term:");
	// This is the way that node.js collects use input from the 
	// command-line
	process.stdin.on('data', function( text ) {
		// conduct your search
		var idx = index.search(text, {fields:{title:{boost:2},text:{boost:1}}});
		// print out the returned objects for that search
		for( var i=0; i<idx.length; i++ )
		{
			console.log( JSON.stringify(idx[i]) );
		}
		console.log("");
		console.log("type in your search term:");
	});
}
else
{
	console.log("index == NULL");
}
