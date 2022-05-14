
const tmi = require('tmi.js');
const fetch = require("node-fetch");
var pluralize = require('pluralize');

// env var
require('dotenv').config();

// Adjective identifier
const natural = require('natural');
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';
var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
var ruleSet = new natural.RuleSet('EN');
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);


// BEFORE program start

// PASSED prerequisites

const {CHANNEL_NAME, OAUTH_TOKEN, BOT_USERNAME} = require ('./constants');
const { username, channel } = require('tmi.js/lib/utils');
const { followersmode } = require('tmi.js/lib/commands');

// Define config options
const opts = {
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN
  },
  channels: [
    CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Sucessfully connected
console.log("Connected to " + CHANNEL_NAME+"...");


let numMsg = 0; // # of non-bot messages since last response
let enabled = true; // frankrbot status
let respondRate = 0; // Message rate

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) { // xx

const message = msg.trim();
let raw = "";
let command = "";
let argument = "";

  let obj = []

  console.log(context['display-name'] + ": " + msg); // log msg 
  try {
    obj = getArgs(message)
    raw = (obj[0])
    command = (obj[1])
    argument = (obj[2])

  } catch (error) {
    //return;
  }

  if (self) { return; } // Ignore messages from bots
  if (context.username == BOT_USERNAME || context.username == "robotcheekii" || context.username == "nightbot" || context.username == "streamlabs" || context.username == "streamelements" || context.username == "buttsbot") {
    return;
  } else {
    numMsg++;

    // Remove whitespace from chat message
    const message = msg.trim(); 

    // Check if messager is a moderator
    
    let isMod = false;
    if(context['badges-raw'] != null) {
      isMod = context['badges-raw'].includes("broadcaster")
       || context['badges-raw'].includes("moderator");
    }

    /**
     * Logic to trigger Frank commands:
     * 
     * Generate a random number
     * 
     */
    const randNum = Math.floor((Math.random() * 100) + 1);

    // If the command is known, let's execute it
    if (message.includes("!define")) { // Get definition
      define(target, message);

    } else if  (message.localeCompare("!hops") == 0) { // Say hops
      client.say(target, "Yay hops! 🐇");

    } else if (message.localeCompare("!kaka") == 0) { // Say kaka
      client.say(target, "💩💩💩");

    } else if (message.includes("!and ")) { // Create a string of words
      and(target, argument, 6);
      
    } else if(message.localeCompare("!about") == 0) {
      client.say(target,"Hi! I'm frankrbot, a chat bot based on the one and only, frankfrodz OhMyDog")

    } else if(message.localeCompare("!h") == 0) {
      client.say(target,"/me commands: !setfreq <respond every x # of messages>, !off [disable frankrbot], !on [enable frankrbot]");

    } else if(message.includes("!off") && isMod) {
      client.say(target, "Bye bye! OhMyDog");
      enabled = false;

    } else if (message.includes("!on") && isMod) { 
      client.say(target, "I'm back! FrankerZ");      
      enabled = true;
      
    } else if (message.includes("!setfreq ") && isMod) {
      // Get integer argument
      const arg = message.substring("!setfreq ".length,message.length);
      const num = setFreq(arg);

      if(num == -1) {
        client.say(target,"'!setfreq' requires a positive number")
        return;
      }
      
      client.say(target, "I'll try to respond every " + arg + " message(s)!")
      respondRate = arg;
    }
    else if (message.substring(0, 1) === "!") { // ! used, but not recognized
      console.log("! - unknown command");

    } else if (!enabled) {
      console.log("frankrbot is disabled. use !on to re-enable")

    } else if (numMsg % respondRate != 0 && respondRate != 0) { // # of messages < response rate
      console.log("Waiting...")
      
    } else if (message.includes("pierogi")) {
      client.say(target, "Yay pierogis! 🥟 🥟 🥟")

    } else if (message.includes("yay ")) {
      client.say(target, " yay " + context.username + "! OhMyDog")

    }

    

    // AUTO BEHAVIOR
    else if (randNum <= 80) { // FRANK-IFY MESSAGE
      console.log("Frank-ifying...");
      frank(target, message);
      
    } else if (randNum > 80) { 
      console.log("Emoji-fying...")
      emoji(target, message);
    } 
    else {
      console.log("running no commands")
    }
  }
}

// Functions
function setFreq(arg) {
  if(isNaN(arg) || arg == '' || arg < 0) {
    return -1;
  } 
  
  return arg
}

// get command args
function getArgs(message) {
  const obj = message.match(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
  return obj;
}

/**
 * Fetches JSON response from an API endpoint url
 * @param {String} rawUrl url with 'RPLCE' in place of the search query
 * @param {String} arg search query
 * @returns JSON object
 */
async function callAPI(rawUrl, arg) {
  const url = rawUrl.replace("RPLCE",arg); // api endpoint url
  const response = await fetch(url); // fetch json
  const data = await response.json(); // store json

  return data;
}

/**
 * Strings together words that commonly follower one another
 * @param {*} target 1st parameter for .say()
 * @param {String} argument English word
 * @param {int} x Number
 */
async function and(target, argument, x) {

  // Words to ignore
  const ignore = ["and","the","a","to","for","in","is","of","that","with","on","his","i","he"];
  
  // isolate first argument
  let arg = argument.split(" ")[0]
  
  // remove white space
  arg = arg.replace(/\s/g, '');

  // rel_gba: words that commonly follow the ${arg} 
  // arg: 'vice' --> return: 'president'
  const newUrl = 'https://api.datamuse.com/words?rel_bga=RPLCE'; // v2; replace query with RPLCE

  let data = await callAPI(newUrl, arg)

  try {
    let wordsIndex = 0; // Which word to choose from JSON response
    let fol = [] // following words

    for (let index = 0; fol.length < x; index++) {
      if (wordsIndex == 0 && index != 0) {
        data = await callAPI(newUrl, fol[fol.length - 1]);
      }

      if (ignore.includes(data[wordsIndex]['word'])) {
        wordsIndex++;
      } else {
        fol.push(data[wordsIndex]['word'])
        wordsIndex = 0;
      }
    }

    let out = ""
    fol.forEach(word => {
      out = `${out} ${word} `;
    });
    client.say(target, `${argument} ${out}`); // Send message
  } catch (error) {
    // console.log("ERROR: getting following word");
    // console.log(error)
  }
}


// Function called 19 times out every 20 messages
/**
 * Emoj-ify one of your words
 * @param {*} target
 * @param {String} msg 
 */
async function emoji(target, msg) {
  const replaced = (msg.replace(/[^a-z0-9 -]/gi, '').toLowerCase()); // remove non-alphanumeric characters
  const words = replaced.split(" ");
  const last = pluralize.singular(words[words.length-1]); 
  // initialize output string
  
  const url = 'https://emoji-api.com/emojis?search=RPLCE&access_key=d60e89d09de78f297a74a57b3029b0dea67dd338'; // api endpoint url
  const data = await callAPI(url, last);


  try { // random emoji from json response
    const rand = Math.floor(Math.random() * data.length);
    const emoji = data[rand]['character'];
    client.say(target, emoji);
  } catch (error) {
    console.log("Emoji-fy failed!");
  }
}

// Function called when the "define" is issued
/**
 * Gives a short definition of a word
 * @param {*} target 1st parameter of .say()
 * @param {String} msg word to define
 */
async function define(target, msg) {
  // Get message argument
  const word = getArgs(msg)[2].toLowerCase();

  // Make an API request
  const url = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/RPLCE?key=1e9ca186-79a5-4154-8da2-fe9da5f63738'; // api endpoint url
  const data = await callAPI(url, word)
  
  // Define a couple of error responses
  const errResponses = ["Either, " + word + ", is not a word, or I should read more...",
  "I didn't know we were making up words!", "I'm feeling sleepy; maybe try a different word?"];
  const randResponse = errResponses[Math.floor(Math.random() * errResponses.length)]; // gen rand response
  
  try { // Try getting a short definition from JSON
    const def = data[0]['shortdef'][0];
    client.say(target, `${word}: ${def}`); // Outputting definition
  } catch (error) {
    client.say(target, randResponse);
  }
}

function getADJ(sentence) {
  var tagged = tagger.tag(sentence);
  var adjIndex = new Array(sentence.length);
  for (let index = 0; index < sentence.length; index++) {
    if (tagged['taggedWords'][index]['tag'] == 'JJ' 
    || tagged['taggedWords'][index]['tag'] == 'RB'
    || tagged['taggedWords'][index]['tag'] == 'DT'
    || tagged['taggedWords'][index]['tag'] == 'NN'
    || tagged['taggedWords'][index]['tag'] == 'UH') { 
      adjIndex[index] = true;
    }
  }
  return adjIndex;
}

/**
 * Replace words in a sentence with their antonyms
 * @param {*} target 1st parameter of .say() 
 * @param {String} msg viewer message
 */
async function frank(target, msg) {
  // Some of frank's signature emotes
  const frankEmotes = ["FrankerZ", "OhMyDog", "ResidentSleeper", "PogBones", "CaitlynS ", "", ""];
  const randEmote = Math.floor(Math.random() * frankEmotes.length);

  let sentence = getSplitArr(msg);
  const adjIndex = getADJ(sentence) // Gets an array of adjectives
  
  let words = ""; // initialize output string
  const ants = [];
  let admitOut = false; 
  const rawUrl = 'https://api.datamuse.com/words?rel_ant=RPLCE'; // api endpoint url

  // Make API requests and build the antonyms array
  for (let index = 0; index < adjIndex.length; index++) {
    if (adjIndex[index]) {
      data = await callAPI(rawUrl, String(sentence[index]));
      try {
        if (data.length == 1) { // Only one word in the JSON response
          ants[index] = data[0]['word'];
          continue;
        }

        if (data[0]['word'].length < data[1]['word'].length) { // first word is fewer letters than second word
          ants[index] = data[0]['word'];
          continue;
        } 
        
        ants[index] = data[1]['word'];
        
      } catch (error) {
        admitOut = false;
        console.log("ERROR: 'word' undefined | output: false");
      }
    }
  }

  sentence.forEach(function callback(letter, index) {
    if (adjIndex[index]) {
      if (ants[index] == undefined) {
        words = `${words} ${letter}`;
      } else {
        admitOut = true;
        words = `${words} ${ants[index]}`
      }
    } else {
      if (letter.includes("-")) {
        var temp = letter.substring(1, sentence.length - 1);
        words += `${temp} `;
      } else {
        words += letter; // add pre-cursor words
      }
    }
  });
  if (admitOut) {
    client.say(target, `${words} ${frankEmotes[randEmote]}`);
  } else {
    console.log("Frank-ify failed!")
    console.log("Emoji-fying...")
    emoji(target,msg)
  }
}

// return an array of strings and characters
function getSplitArr(str) {
  var split = str.split("");
  var join = [];
  var joinInd = 0;
  const regex = /[\w\']/;
  var word = "";
  split.forEach(function callback(letter, index) {
    if (regex.test(letter)) {
      word += letter;
    } else {
      join[joinInd] = word; // add word to join arr
      joinInd++;
      join[joinInd] = `-${letter}`; // now, add non-alphanum char to join arr with '-'
      joinInd++;
      word = "";
    }
    if (index == split.length - 1 && word != "") { // last iteration
      join[joinInd] = word;
      joinInd++;
      word = "";
    }
  });
  return join;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`*Connected to ${addr}:${port}`);
}