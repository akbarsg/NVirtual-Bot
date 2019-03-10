var rp = require("request-promise");
var Discord = require("discord.js");

exports.commands = [
	"verify"
];

exports['verify'] = {
	usage: '<Pilot ID>',
	description: 'Verifikasi akun NVirtual Anda dengan Discord',
	process: function(bot, msg, suffix) {
		// variable to hold matches
		var matches = [];
		// get pilotID to search
		var pilotID = suffix.split(' ')[0];
		// get search string
		// var searchString = suffix.slice(pilotID.length + 1);
		// var searchRegex = new RegExp(searchString, 'i');
        // pull the data of the pilotID in question
        var pilotID = pilotID.replace(/\D/g,'');
		var restString = 'https://crew.nvirtual.net/index.php/api/discord/' + pilotID ;
		var data;
		rp(restString)
		.then(function(response) {
            data = JSON.parse(response);

            if(pilotID.length == 1) {
                pilotID = '00' + pilotID;
            } else if(pilotID.length == 2){
                pilotID = '0' + pilotID;
            }

            if(data) {
                if(data.discord == msg.author.username) {
                    var nickname = 'NVX' + pilotID + ' | ' + data.firstname + ' ' + data.lastname;
                    
                    msg.member.setNickname(nickname);
                    msg.member.addRole('NVX Member');
    
                    msg.channel.send('Akun @' + msg.author.id + ' dah diverifikasi ٩(^ᴗ^)۶')
    
                    let embed = new Discord.RichEmbed()
                        .setAuthor(nickname)
                        .setColor('#FF6600')
                        .setThumbnail('https://crew.nvirtual.net/lib/avatars/NVX' + pilotID + '.png')
                        .addField('Rank', data.rank)
                        .addField('Flight Hours', data.totalhours + ' hours')
                        .addField('Total Flights', data.totalflights + ' flights');
    
    
                    msg.channel.send({embed : embed});
                } else {
                    msg.channel.send('@' + msg.author.id + ' maaf, kayaknya username Discord gak cocok sama profil NVirtual-nya. Coba dicek lagi (ㄒoㄒ)')
                }
            } else {
                msg.channel.send('@' + msg.author.id + ' maaf, datanya gak ada. Coba cek lagi Pilot ID NVirtual-nya (-д-；)')
            }
            

            
		})
		.catch(function(error) {
			msg.channel.send("Hmm, kayaknya ada yang salah: " + error);
		});
	}
}
