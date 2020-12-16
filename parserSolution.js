let Parser = require('rss-parser');
let parser = new Parser();
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let feedName = process.argv.slice(2)[0];
const promptUserForFeedName = ()=>{
    return new Promise(resolve => {
        rl.question("Enter RSS feed URL ", function(name) {
            resolve(name);
        });
    });
};

const promptUserForAnother = ()=>{

    return new Promise(resolve => {
        rl.question("Try again? ", function(confirm) {
            resolve(confirm==null || confirm.substring(0,1).toLowerCase()!=='y');
        });
    });
};

const displayFeedData = (feed) => {
    return new Promise(resolve => {
        feed.items.forEach(async item => {
            await displayItemData(item);
            resolve(true)
        });
    });
}

const displayItemData = (item) => {

    return new Promise(resolve => {
        console.log('Title: '+(item.title||'N/A'));
        console.log('\tDescription: '+(item.description||'N/A'));
        console.log('\tLink: '+(item.link||'N/A'));
        console.log('\n');
        resolve(true)
    });
}
(async (promptUserForFeedName,promptUserForAnother,displayFeedData) => {
    console.log(feedName);
    let complete = false;
    while(!complete) {
        if (feedName == null) {
            feedName = await promptUserForFeedName();
            if(feedName==null){
                console.log('cannot understand');
                complete=false;
            }
        }

        if (feedName !=null) {
            let feed = await parser.parseURL(feedName);
            console.log(feed.title);

            await displayFeedData(feed);
            complete = await promptUserForAnother();
            if(!complete){
                feedName=null;
            }
            let one = 1;
        }
    }
    process.exit(0);
})(promptUserForFeedName,promptUserForAnother,displayFeedData);
