const { Telegraf } = require('telegraf')
const { App } = require('@voiceflow/runtime-client-js');
let chatbot;


const bot = new Telegraf('1684324609:AAEonQL1LQfEoRu3w_uUqPXejQ2yZNwIn6Q');

bot.start(async (ctx) => {
  chatbot = new App({
    versionID: '600b11fb8bf190001bafc381',
    endpoint: 'https://localhost:4000'
  });

  const newState = await chatbot.start();

  let newstate2 = await chatbot.sendText("hi");
  ctx.reply("hola");	
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
