exports.commands = [
    "talk"
]

// var cleverbot = require("cleverbot.io");
var cleverbot = require("better-cleverbot-io")
// talkbot = new cleverbot(process.env.CLEVERBOT_API_USER, process.env.CLEVERBOT_API_KEY);
talkbot = new cleverbot({user: process.env.CLEVERBOT_API_USER, key: process.env.CLEVERBOT_API_KEY,nick:'Envi'});

exports.talk = {
    usage: "<message>",
    description: "I can talk in English too.. Let's chat with me!",
    
    process: function(bot, msg, suffix) {
        // talkbot.create(function (err, session) {
        //     talkbot.ask(suffix, function (err, response) {
        //         msg.channel.send(response);
        //     });
        // });
        
        talkbot.create().then(() => {
            talkbot.ask(suffix).then(response => {
                msg.channel.send(response);
            });
        }).catch(err => {
            msg.channel.send("Maap.. eh sorry, I can't reply to that: " + err);
        });
        
    }
}
