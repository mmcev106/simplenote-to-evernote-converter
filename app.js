var fs = require('fs')
var xmljs = require('xml-js');
var filePath = process.argv[2]

var handleXml = function(xml){
	var result1 = xmljs.xml2js(xml);
	console.log(JSON.stringify(result1.elements[1].elements, null, 2));
}

var handleJs = function(js){
	console.log(`
		<?xml version="1.0" encoding="UTF-8"?>
		<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export3.dtd">
		<en-export export-date="20190804T214724Z" application="Evernote" version="Evernote Mac 7.12 (457935)">
	`)

	JSON.parse(js).activeNotes.forEach(function(note){
		var content = note.content.split(' ').join(' ')
		var parts = content.split('\r\n')
		var title = parts.shift()
		console.log('<note><title>' + title + '</title>')
		console.log(`
		      <content><![CDATA[<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note><div>` + parts.join('</div><div>') + `</div></en-note>]]></content>
		      <created>20190804T214651Z</created>
		      <updated>20190804T214653Z</updated>
		      <note-attributes>
		         <author>Mark McEver</author>
		         <source>desktop.mac</source>
		         <reminder-order>0</reminder-order>
		      </note-attributes>
		   </note>
		`)
	})

	console.log(`
		</en-export>
	`)
}

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
    if(err){
    	console.log('Error reading file: ' + err);
    } else {
        handleJs(data)
    }
});