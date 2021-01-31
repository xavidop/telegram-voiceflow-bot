![image](/images/bot-father.png)

# telegram-voiceflow-bot

Since Telegram Bot has appeared, I always interested in how they work. So I decided to build simple Telegram Bot with Node.js and Telegraf. Telegraf is a modern bot framework for Node.js.

## Create own Bot with BotFather

First, We should create own bot with BotFather. BotFather is the one bot to rule them all. We will use it to create new bot accounts and manage your existing bots.

If you open a chat with a BotFather, click on the “Start” button.

We should create a new bot by clicking /newbot command. Next, you should enter any name for the bot. I named Cupido 

## Setting up the Project

Install and run the project:

1. Clone this repo:
```
git clone https://github.com/xavidop/teelgram-voiceflow-bot.git
```

2. Install dependencies:
```
yarn install
```

3. Launch project:
```
yarn start
```

## Write bot’s code

We can create bot by the following code lines:
```js
const Telegraf = require('telegraf') // import telegram lib

const bot = new Telegraf(process.env.BOT_TOKEN) // get the token from envirenment variable
bot.start((ctx) => ctx.reply('Welcome')) // display Welcome text when we start bot
bot.hears('hi', (ctx) => ctx.reply('Hey there')) // listen and handle when user type hi text
bot.launch() // start
```

We can change bot’s icon by /mybots command.

Let's create the Voiceflow client to work with Voiceflow's cloud:
```js
async function initializeclient(forceRestart){
    if(chatbot === null || chatbot === undefined || forceRestart){
        chatbot = new App({
            versionID: process.env.VOICEFLOW_PROGRAM
        });
        return startState = await chatbot.start();
    }
    return null;
}
```

Let's replace the start starndard replay for this one, getting the correct replay from Voiceflow:

```javascript

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.start(async (ctx) => {
  conversationEnded = false;
  let startState = await initializeclient(true);
  ctx.reply(startState.trace[0].payload.message);	
});

```

Then we replace the `hi` utterance for a regex like `(.+)`. This means that the bot will hear for everything. All the text recieved we will pass directly to Voiceflow and the we mange the state of the conversation: if it is ended or if it is not ended yet:

```javascript

const regex = new RegExp(/(.+)/i)
bot.hears(regex, async (ctx) =>{ 
    let replay = '';
    if(!conversationEnded){
        await initializeclient();
        const newState = await chatbot.sendText(ctx.message.text);
        
        if(newState.trace.length === 0){
            replay += "Sorry, I did not understand you. Can you repeat, please?"
        }else{
            replay = newState.trace[0].payload.message;
        }

        if(newState.end){
            replay += "\nIf you want to start again just write /start"
            conversationEnded = true;
        }
    }else{
        replay = "\nThe Conversation has ended. If you want to start again just write /start"
    }

    ctx.reply(replay)
})

```

This is the final architecture:

![image](/images/architecture.png)

## Our Telegram Bot

![image](/images/bot.png)

## How to contribute?

1. Fork this repo
2. Clone your fork
3. Code 🤓
4. Test your changes
5. Submit a PR!
