# frankrbot v0.0.2 - CheekiiBoom

Welcome to frankrbot!

This bot is a node js application which can read and write Twitch chat messages.  
frankrbot utilizes word APIs to analyze messages and send tasteful responses

## Installation
After downloading and extracting the zip files,
this Twitch chat bot requires an edit to the contents of credentials.txt  
Follow the steps below to fill out the three text fields in credentials.txt


#### 1. Open the file, 'credentials.txt' in 'src'

#### 2. Replace, CHANNEL_NAME, with your twitch channel username in lowercase (ex: nodemon0092)  


- At this point you may want to hide your screen if you're live streaming this process 
- Keep your OAUTH_TOKEN private! 
#### 3. Next, you need an OAUTH_TOKEN (this token allows the bot to read and send messages in your chat):

_Please see the instructions below the URL to continue_
###### https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=joi6lzr5q685lmatb8ogacawohj6d3&redirect_uri=http://localhost:3000&scope=chat%3Aread+chat%3Aedit

- Go to the url in your favorite browser
- Twitch will prompt you to authorize the bot application
- After you press authorize, you are redirected to a different URL. _Ignore the message that says something went wrong (may say: This site can't be reached)_
- On this web page, look at the searchbar, and **ONLY** copy and paste the access token from the URL as shown below

`http://localhost:3000/#access_token=` _<**this is your access token**>_ `&scope=chat%3Aread+chat%3Aedit&token_type=bearer`  
_General note: be sure to remove the '< >' characters_
#### 4. Enter your acess token in the OAUTH_TOKEN field (ex: OAUTH_TOKEN=1hd23jdijh3jjndf3j )
Example:
  ```
 OAUTH_TOKEN=1hd23jdijh3jjndf3j
```
#### 5. Replace BOT_USERNAME with your twitch username (ex: nodebot)
Example:
```
 BOT_USERNAME=nodebot
  ```
#### 6. Save the credentials.txt file and run the 'bot.exe' file in the folder, 'src'

Example of credentials.txt
```
CHANNEL_NAME=nodemon0092
OAUTH_TOKEN=1hd23jdijh3jjndf3j
BOT_USERNAME=nodebot
```
If all goes well, and frankbot takes life, type !h for more information :D OhMyDog

## Commands:
```
!h - Essential frankrbot commands
!on - Enable frankrbot
!off - Disable frankrbot
!setfreq <positive number> - frankrbot response rate
!about - A short description about frankrbot
!define <word> - Returns a short definition
!and <word> - frankrbot guesses the next 5 words

```

## Auto-behavior:

```
Emoj-ify - Replace the last word in a message with an emoji
Frank-ify - Replace the adjectives in a message with antonyms 
```
