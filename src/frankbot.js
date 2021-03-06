
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
const { words } = require('natural/lib/natural/util/stopwords');

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

  const bannedRegEx = /\b(4r5e|holocaust|rape|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
  const message = msg.trim();
  

  let raw = "";
  let command = "";
  let argument = "";
  
  let obj = []
  
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
    console.log(context['display-name'] + ": " + msg); // log msg 
    //console.log(numMsg)
    
    
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

    // Cancel bad words
    try {
      if (message.match(bannedRegEx) != null) {
        try {
          const check = (message.match(bannedRegEx))
          if (check.length > 0) {
            console.log("Banned word: Cancelling...")
          }
        } catch (error) {
        }
        client.say(target, ("???? FrankerZ ????"));
      }
       else if (message.localeCompare("!about") == 0) {
        client.say(target, "Hi! I'm frankrbot, a chat bot based on the one and only, frankfrodz OhMyDog")

      } else if (message.localeCompare("!h") == 0) {
        client.say(target, "/me commands: !setfreq <respond every x # of messages>, !off [disable frankrbot], !on [enable frankrbot]");

      } else if (message.includes("!off") && isMod) {
        client.say(target, "Bye bye! OhMyDog");
        enabled = false;

      } else if (message.includes("!on") && isMod) {
        client.say(target, "I'm back! FrankerZ");
        enabled = true;

      } else if (message.includes("!setfreq ") && isMod) {
        // Get integer argument
        const arg = message.substring("!setfreq ".length, message.length);
        const num = setFreq(arg);

        if (num == -1) {
          client.say(target, "'!setfreq' requires a positive number")
          return;
        }

        client.say(target, "I'll try to respond every " + arg + " message(s)!")
        respondRate = arg;
        numMsg = 0;
      }
      else if (!enabled) {
        console.log("frankrbot is disabled. use !on to re-enable")
      }
      
      else if (message.includes("!define")) { // Get definition
        define(target, message);
      } else if (message.localeCompare("!hops") == 0) { // Say hops
        client.say(target, "Yay hops! ????");

      } else if (message.localeCompare("!kaka") == 0) { // Say kaka
        client.say(target, "????????????");

      } else if (message.includes("!and ")) { // Create a string of words
        and(target, argument, 6);

      } 
      else if (numMsg % respondRate != 0 && respondRate != 0) { // # of messages < response rate
        
        console.log("Waiting...")

      } else if (message.includes("pierogi")) {
        client.say(target, "Yay pierogis! ???? ???? ????")

      } else if (message.includes("yay ")) {
        client.say(target, " yay " + context.username + "! OhMyDog")

      }



      // AUTO BEHAVIOR
      else if (randNum <= 80) { // FRANK-IFY MESSAGE
        // console.log("Frank-ifying...");
        frank(target, message);

      } else if (randNum > 80) {
        // console.log("Emoji-fying...")
        emoji(target, message);
      }
      else {
        console.log("running no commands")
      }
    } catch (error) {

    }

  }
  numMsg++;
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
  const ignore = ["and","the","a","to","for","in","is","of","that","with","on","his","i","he","are","not","be","used","as","was","had","has","been","made","by","at","or","would","which","were","up","from","than","one","period","when","any","other","it"];
  
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
      
      if (ignore.includes(data[wordsIndex]['word']) || /\d/.test(data[wordsIndex]['word'])) {
        wordsIndex++;
      } else {
        fol.push(data[wordsIndex]['word'])
        wordsIndex = 0;
      }
    }

    let out = ""
    for (let index = 0; index < fol.length; index++) {
      if(isNoun(fol[index]) && index > 4 || index > 4) {
      } else {
        out += `${fol[index]} `;
      }
    }
    client.say(target, `${argument} ${out}`); // Send message
  } catch (error) {
    // console.log("ERROR: getting following word");
    console.log(error)
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
    numMsg--;
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
  "I didn't know we were making up words!", "I'm feeling sleepy... Maybe try a different word?","I'll get back to you on that one"];
  const randResponse = errResponses[Math.floor(Math.random() * errResponses.length)]; // gen rand response
  
  try { // Try getting a short definition from JSON
    const def = data[0]['shortdef'][0];
    client.say(target, `${word}: ${def}`); // Outputting definition
  } catch (error) {
    client.say(target, randResponse);
  }
}
/**
 * Check if a word is a noun
 * @param {String} word 
 * @returns boolean
 */
function isNoun(word) {
  const wordArr = [word]
  var tagged = tagger.tag(wordArr);
    if (tagged['taggedWords'][0]['tag'] == 'NN') { 
      return true;
    }
  return false;
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
        // console.log("ERROR: 'word' undefined | output: false");
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
    // console.log("Emoji-fying...")
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