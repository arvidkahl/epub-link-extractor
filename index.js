#!/usr/bin/env node

/*

How to use this: chmod+x the script file, then:

 ./index.js --file="/some/path/to/your/file.epub"

 */


const EPub = require("epub");
const $ = require('cheerio')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

if (argv.file) {
  let epub = new EPub(argv.file);

  epub.on("end", function(){
    epub.flow.forEach(function(chapter){
      epub.getChapter(chapter.id, (e,text)=>{
        let items = []
        $(text).find("a[href^='http']").each((i, item)=>{
          items.push(item)
        })
        if(items.length) {
          console.log("Links in Chapter ", chapter.title, `[${chapter.order}/${epub.toc.length}] \n============================================`)
          for (var i of items) {
            console.log($(i).text(), ": ", $(i).attr('href'))
          }
          console.log("\n")

        }
      })
    });
  });
  epub.parse();

} else {
  console.log('No file name given')
}
