const { Telegraf } = require('telegraf')
const App = require('@voiceflow/runtime-client-js');
require('dotenv').config();

let chatbot;
let conversationEnded = false;

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.start(async (ctx) => {
  conversationEnded = false;
  let startState = await initializeclient(true);
  ctx.reply(startState.getResponse()[0].payload.message);	
});

const regex = new RegExp(/(.+)/i)
bot.hears(regex, async (ctx) =>{ 
    let replay = '';
    if(!conversationEnded){
        await initializeclient();
        const newState = await chatbot.sendText(ctx.message.text);
        
        if(newState.getResponse().length === 0){
            replay += "Sorry, I did not understand you. Can you repeat, please?"
        }else{
            replay = newState.getResponse()[0].payload.message;
        }

        if(newState.isEnding()){
            replay += "\nIf you want to start again just write /start"
            conversationEnded = true;
        }
    }else{
        replay = "\nThe Conversation has ended. If you want to start again just write /start"
    }

    ctx.reply(replay)
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


async function initializeclient(forceRestart){
    if(chatbot === null || chatbot === undefined || forceRestart){
        chatbot = new App.default({
            versionID: process.env.VOICEFLOW_PROGRAM
        });
        return startState = await chatbot.start();
    }
    return null;
}