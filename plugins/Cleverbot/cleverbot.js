exports.commands = [
    "talk"
]

var cleverbot = require("cleverbot.io");
talkbot = new cleverbot(process.env.CLEVERBOT_API_USER, process.env.CLEVERBOT_API_KEY);

exports.talk = {
    usage: "<message>",
    description: "Let's chat with me!",

    process: function(bot, msg, suffix) {
        talkbot.setNick("Envi");
        talkbot.create(function (err, session) {
            talkbot.ask(suffix, function (err, response) {
                console.log(response); 
                msg.channel.send(response);
            });
        });
        
    }
}
