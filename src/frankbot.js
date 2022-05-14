
const tmi = require('tmi.js');
const fetch = require("node-fetch");
var pluralize = require('pluralize');
//var noun = require('wordnet');

// env
require('dotenv').config();

const natural = require('natural');
//const wordnet = new natural.WordNet();

const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';

var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
var ruleSet = new natural.RuleSet('EN');
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

const {CHANNEL_NAME, OAUTH_TOKEN, BOT_USERNAME} = require ('./constants');
const { username, channel } = require('tmi.js/lib/utils');
const { followersmode } = require('tmi.js/lib/commands');

// Define configuration options
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


let numMsg = 0;
let enabled = true;

let respondRate = 0; // set to 5 

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) { // xx


const message = msg;
let valid = true;
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
    // console.log("Error with promise...")
    //return;
  }

  if (self) { return; } // Ignore messages from bots
  if (context.username == BOT_USERNAME || context.username == "robotcheekii" || context.username == "nightbot" || context.username == "streamlabs" || context.username == "streamelements" || context.username == "buttsbot") {
    return;
  } else {
    numMsg++;

    // Remove whitespace from chat message
    const commandName = msg.trim() + ""; 

    // Check if messager is a moderator
    
    let isMod = false;
    if(context['badges-raw'] != null) {
      isMod = context['badges-raw'].includes("broadcaster") || context['badges-raw'].includes("moderator");
    } else {
      isMod = false;
    }

    /**
     * Logic to trigger Frank commands:
     * 
     * Generate a random number
     * 
     */
    const randNum = Math.floor((Math.random() * 13) + 1);

    // If the command is known, let's execute it
    if (commandName.includes("!define")) { // !define issued 

      define(target, context, msg, self);

    } else if  (commandName.includes("!hops")) {
      client.say(target, "Yay hops! 🐇");
    } else if (commandName.includes("!kaka")) {
      client.say(target, "💩💩💩");
    } else if (commandName.includes("!and ")) {
      and(target, argument, 6);
    }

    else if(commandName.localeCompare("!about" == 0)) {
      client.say(target,"Hi! I'm frankrbot, a chat bot based on the one and only, frankfrodz OhMyDog")
    }
    else if(commandName.localeCompare("!h") == 0) {
      client.say(target,"/me commands: !setfreq <respond every x # of messages>, !off [disable frankrbot], !on [enable frankrbot]");
    } else if(commandName.includes("!off") && isMod) {
      client.say(target, "Bye bye! OhMyDog");
      enabled = false;
    } else if (commandName.includes("!on") && isMod) { 
      client.say(target, "I'm back! FrankerZ");      
      enabled = true;
    } else if (commandName.includes("!setfreq ") && isMod) {
      const arg = commandName.substring("!setfreq ".length,commandName.length);
      if(isNaN(arg) || arg == '') {
        client.say(target,"!setfreq requires a number")
      } else if (arg >= 0){
        if(arg != 1) {
          client.say(target,"I will try to respond every " + arg + " messages!")
        } else {
          client.say(target,"I will try to respond every " + arg + " message!")
        }
      } else {
        client.say(target,"I can't go back in time!")        
      }
      respondRate = arg;
    }
    else if (commandName.substring(0, 1) === "!") { // ! used, but not recognized
      console.log("! - unknown command");
    } else if (!enabled) {
      console.log("frankrbot is disabled. use !on to re-enable")
    }
    else if (numMsg % respondRate != 0 && respondRate != 0) { // waits for # of msgs to exceed response rate
      console.log("waiting...")
    }
    else if (commandName.includes("pierogi")) {
      console.log(`numMsg: ${numMsg} | respondRate: ${respondRate}`)
      client.say(target, "Yay pierogis! 🥟 🥟 🥟")
    }
    else if (commandName.includes("yay ")) { // responds if message contains 'yay '
      client.say(target, " yay " + context.username + "! OhMyDog")
    }
    else if ((commandName.includes("papaya") || commandName.includes("cookie") || commandName.includes("mango")) && numMsg >= respondRate) {
      if (commandName.includes("papaya")) {
        client.say("mmm delicious papaya! FrankerZ")
      } else if (commandName.includes("cookie")) {
        client.say("mmm delicious papaya! OhMyDog")
      } else {
        client.say("mmm delicious papaya! ChefFrank")
      }
    } 

    // AUTO BEHAVIOR
    else if (randNum < 8) { // FRANK-IFY MESSAGE
      console.log("running Frank-ify");
      
      frank(target, context, msg, self);
      
    } else if (randNum >= 8 && randNum <= 13) { // Runs if randNum is 
      
      console.log("running emoji")
      emoji(target, context, msg, self);
      
    } 
    else {
      console.log("running no commands")
      //
    }
  }
}

// get command args
function getArgs(message) {
  const obj = message.match(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
  return obj;
}

/**
 * Makes an api call with argument
 * @param {String} rawUrl 
 * @param {String} arg 
 */
async function callAPI(rawUrl, arg) { // rawUrl with delimiter, "RPLCE"
  const url = rawUrl.replace("RPLCE",arg); // api endpoint url
  console.log("URL: " + url)
  const response = await fetch(url); // urlfetch json
  const data = await response.json(); // store json

  return data;
}

// API adds extra words to your word
/**
 * 
 * @param {*} target 
 * @param {String} argument 
 * @param {int} x 
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

  let data = {}

  try { // try getting a 'word'
    let fol = [] // the result word

    let tempIter = 0;
    for (let index = 0; fol.length < x; index++) {
      if (index == 0) {
        temp = await callAPI(newUrl, arg);
      } else if (fol.length > 0 && tempIter == 0) {
        temp = await callAPI(newUrl, fol[fol.length - 1]);
        // console.log("Searching '"+fol[fol.length-1]+"'")
      }

      if (ignore.includes(temp[tempIter]['word'])) {
        tempIter++;
      } else {
        fol.push(temp[tempIter]['word'])
        tempIter = 0;
      }
    }

    fol[0] == "" ? fol.push(data[0]['word']) : 0; // failed to get a non-blacklisted word

    let out = ""
    for(let index = 0; index < fol.length; index++) {
      out = out + fol[index] + " ";
    }
    client.say(target, argument+" "+out); // definition successful, output to chat
  } catch (error) {
    // console.log("ERROR: getting following word");
    // console.log(error)
  }
}


// Function called 19 times out every 20 messages
async function emoji(target, context, msg, self) {
  const string = ""+msg; // get chat msg
  const replaced = (string.replace(/[^a-z0-9 -]/gi, '').toLowerCase()); // remove non-alphanumeric characters
  const words = replaced.split(" ");
  const first = pluralize.singular(words[words.length-1]); 
  // initialize output string
  const url = 'https://emoji-api.com/emojis?search='+first+'&access_key=d60e89d09de78f297a74a57b3029b0dea67dd338'; // api endpoint url
  const response = await fetch(url); // urlfetch json
  const data = await response.json(); // store json

  try { // try getting first emoji from json
      const rand = Math.floor(Math.random() * data.length);
      const emoji = data[rand]['character'];
      client.say(target, ""+emoji+"");
      console.log(emoji); // output to chat
  } catch (error) {
      console.log("ERROR: could not find emoji");
  }
  
}

// Function called when the "define" is issued
async function define(target, context, msg, self) {
  const defCMD = "!define";
  msg.trim();
  const string = ""+msg.substring(defCMD.length, msg.length); // get chat msg
  const replaced = (string.replace(/[^a-z0-9-]/gi, '').toLowerCase()); // remove non-alphanumeric characters
  const first = replaced.split(" ")[0];
  // initialize output string
  const url = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/' + first + '?key=1e9ca186-79a5-4154-8da2-fe9da5f63738'; // api endpoint url
  const response = await fetch(url); // urlfetch json
  const data = await response.json(); // store json

  try { // try getting 'shortdef' from json
    const def = data[0]['shortdef'][0];
    client.say(target, first + ": " + def); // definition successful, output to chat
  } catch (error) {
    console.log("ERROR: getting definition");
    const errResponses = ["Either, " + first + ", is not a word, or I should read more...", "I didn't know we were making up words!", "I'm feeling sleepy; maybe try a different word?"];
    const randResponse = errResponses[Math.floor(Math.random() * errResponses.length)]; // gen rand response
    //console.log(randResponse);
    client.say(target, randResponse);
    
  }

}

// Function called 1 out of 20 messages
async function frank(target, context, msg, self) {
  let sentence = getSplitArr(msg+"");
  var tagged = tagger.tag(sentence);
  var adjIndex = new Array(sentence.length);
  for (let index = 0; index < sentence.length; index++) {
    if (tagged['taggedWords'][index]['tag'] == 'JJ' || tagged['taggedWords'][index]['tag'] == 'RB') { 
          adjIndex[index] = true;
      }
  }
  let words = ""; // initialize output string

  const row = [];
  const col = [];

  const ants = [];
  let admitOut = false; 

  for (let index = 0; index < adjIndex.length; index++) {
    if (adjIndex[index]) {
      const rawUrl = 'https://api.datamuse.com/words?rel_ant=RPLCE'; // api endpoint url
      data = await callAPI(rawUrl, String(sentence[index]));
      // const response = await fetch(url); // urlfetch json
      // data = await response.json(); // store json

      try {
        //console.log(sentence[index])
        if(data[0]['word'].length < data[1]['word'].length) { // data[0] is less words than data[1]
          ants[index] = data[0]['word'];
        } else {
          ants[index] = data[1]['word'];
        }
        
      } catch (error) {
        admitOut = false;
        console.log("ERROR: '"+ sentence[index] + "' undefined | output: false");
      }
    }
  }

  for (let index = 0; index < sentence.length; index++) {
    if (adjIndex[index]) {
      if (ants[index] == undefined) {
        console.log("ERROR: undefined | using original word");
        words = words + (sentence[index] + "");
      } else {
        admitOut = true;
        words = words + ants[index] + "";
      }
    } else {
      if (sentence[index].includes("-")) {
        var temp = sentence[index].substring(1, sentence.length - 1);
        words = words + (temp + " ");
      } else {
        words = words + (sentence[index] + ""); // add pre-cursor words
      }
    }
  }
  const frankEmotes = ["FrankerZ", "OhMyDog", "ResidentSleeper", "", ""];
  const randEmote = Math.floor(Math.random() * frankEmotes.length);
  if (admitOut) {
    client.say(target, "" + words + " " + frankEmotes[randEmote]);
  } else {
    console.log("Frank-ify failed!")
  }
}


// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// return an array of strings and characters
function getSplitArr(str) {
  var split = str.split("");
  var join = [""];
  var joinInd = 0;
  const regex = /[\w\']/;
  var temp = "";
  for (let index = 0; index < split.length; index++) {
    if (regex.test(split[index])) {
      temp = temp + split[index];
    } else {
      join[joinInd] = temp; // add temp to join arr
      joinInd++;
      join[joinInd] = "-" + split[index]; // now, add non-alphanum char to join arr
      joinInd++;
      temp = "";
    }
    if (index == split.length - 1 && temp != "") { // last iteration
      join[joinInd] = temp;
      joinInd++;
      temp = "";
    }
  }
  return join;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`*Connected to ${addr}:${port}`);
}