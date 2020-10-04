var rp = require("request-promise");
var Discord = require("discord.js");

exports.commands = [
    "verify",
    "reactivate",
    "profile"
];

var auth = {
    'auth': {
      'user': process.env.NVX_ID,
      'pass': process.env.NVX_PASS
    }
  };

exports['verify'] = {
    usage: '<Pilot ID>',
    description: 'Verifikasi akun NVirtual Anda dengan Discord',
    process: function(bot, msg, suffix) {
        // variable to hold matches
        if(msg.channel.type !== 'dm'){
            
            
            // get pilotID to search
            var pilotID = suffix.split(' ')[0];
            // get search string
            // var searchString = suffix.slice(pilotID.length + 1);
            // var searchRegex = new RegExp(searchString, 'i');
            // pull the data of the pilotID in question
            var pilotID = pilotID.replace(/\D/g,'');
            var restString = 'https://crew.nvirtual.net/index.php/api/discord/' + pilotID ;
            var data;
            rp(restString, auth)
            .then(function(response) {
                if (suffix) {
                    data = JSON.parse(response);
                    
                    if(pilotID.length == 1) {
                        pilotID = '00' + pilotID;
                    } else if(pilotID.length == 2){
                        pilotID = '0' + pilotID;
                    }
                    
                    if(data) {
                        if(data.discord == msg.author.username) {
                            var nickname = 'NVX' + pilotID + ' | ' + data.firstname + ' ' + data.lastname;
                            
                            msg.channel.send('Akun <@' + msg.author.id + '> dah diverifikasi ٩(^ᴗ^)۶')
                            
                            let thumbnail = "http://crew.nvirtual.net/lib/avatars/NVX" + pilotID + ".png";
                            
                            let embed = new Discord.RichEmbed()
                            .setAuthor(nickname, msg.author.avatarURL, "https://crew.nvirtual.net/index.php/profile/view/NVX" + pilotID)
                            .setColor('#FF6600')
                            .setDescription("Profil Akun NVirtual")
                            .setThumbnail(url=data.picture)
                            .addField('Rank', data.rank)
                            .addField('Flight Hours', data.totalhours + ' hours')
                            .addField('Total Flights', data.totalflights + ' flights')
                            .setFooter("NVirtual Crew", "https://nvirtual.net/img/bulet-64.png");
                            
                            console.log("https://crew.nvirtual.net/lib/avatars/NVX" + pilotID + ".png");
                            
                            if (!msg.member.roles.find("name", "Staff NVX")){
                                msg.member.setNickname(nickname);
                                msg.member.addRole(process.env.ROLE_ID);
                            }                    
                            
                            msg.channel.send({embed : embed});
                        } else {
                            msg.channel.send('<@' + msg.member.id + '> maaf, kayaknya username Discord gak cocok sama profil NVirtual-nya. Coba cek Discord Username Anda di https://crew.nvirtual.net/index.php/profile/editprofile d(>_・ )')
                        }
                    } else {
                        msg.channel.send('<@' + msg.member.id + '> maaf, datanya gak ada. Coba cek lagi Pilot ID NVirtual-nya (-д-；)')
                    }
                } else {
                    msg.channel.send('<@' + msg.member.id + '> maaf, kayaknya salah ketik. Coba ketik !verify sama NVirtual Pilot ID Anda (＾＾)ｂ. Misalnya: !verify NVX002')
                }
                
                
            })
            .catch(function(error) {
                msg.channel.send("Hmm, kayaknya ada yang salah: " + error);
            });
            
        } else {
            msg.channel.send('Maaf, perintah ini bisanya dipakai di channel Discord NVirtual, bukan di DM (-д-；)');
        }
    }
}

exports['reactivate'] = {
    // usage: '<Pilot ID>',$data = PilotData::getPilotData($args[0]);
    description: 'Reaktivasi akun NVirtual Anda',
    process: function(bot, msg, suffix) {
        // variable to hold matches
        
        // get pilotID to search
        // var pilotID = suffix.split(' ')[0];
        // get search string
        // var searchString = suffix.slice(pilotID.length + 1);
        // var searchRegex = new RegExp(searchString, 'i');
        // pull the data of the pilotID in question
        // var pilotID = pilotID.replace(/\D/g,'');
        var restString = process.env.PILOTS_API ;
        var data;
        rp(restString, auth)
        .then(function(response) {
            
            data = JSON.parse(response);
            var pilotID = 0;
            var initialStatus = 0;
            
            if(data) {
                console.log(msg.author.username);
                
                console.log(data.length);
                
                
                for(var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    if (obj['discord'] == msg.author.username) {
                        pilotID = obj.pilotid;
                        initialStatus = obj.retired;
                        break;
                    } 
                }
                
                if(pilotID == 0){
                    msg.channel.send('<@' + msg.author.id + '> maaf, pilot ID nya ga ketemu. Coba tanya ke mas-mas staf ya ╥﹏╥');
                } else {
                    
                    var reactivationString = process.env.REACTIVATION_API + pilotID ;
                    
                    rp(reactivationString, auth)
                    .then(function(response2) {
                        
                        data2 = JSON.parse(response2);
                        
                        if(data2) {
                            var nickname = 'NVX' + pilotID + ' | ' + data2.firstname + ' ' + data2.lastname;
                            
                            if(data2.retired == 0){
                                if (initialStatus == 0) {
                                    msg.channel.send('Akun <@' + msg.author.id + '> sudah aktif kok. Selamat terbang (＾＾)ｂ');
                                } else {
                                    msg.channel.send('Akun <@' + msg.author.id + '> sudah diaktifkan lagi. PIREPnya ditunggu sampai 24 jam ke depan, ya  (＾＾)ｂ');
                                }
                                
                                let thumbnail = "http://crew.nvirtual.net/lib/avatars/NVX" + pilotID + ".png";
                                let embed = new Discord.RichEmbed()
                                .setAuthor(nickname, msg.author.avatarURL, "https://crew.nvirtual.net/index.php/profile/view/NVX" + pilotID)
                                .setColor('#FF6600')
                                .setDescription("Status Akun NVirtual")
                                .setThumbnail(url=data.picture)
                                .addField('Status', 'Active')
                                .setFooter("NVirtual Crew", "https://nvirtual.net/img/bulet-64.png");
                                
                                msg.channel.send({embed : embed});
                                
                            } else {
                                msg.channel.send('Akun <@' + msg.author.id + '> maaf, kayaknya ga bisa saya aktivasi. Coba tanya ke mas-mas staf ya ╥﹏╥');
                            }
                            
                        } else {
                            msg.channel.send('<@' + msg.author.id + '> maaf, ada error ga tau kenapa. Coba tanya ke mas-mas staf ya ╥﹏╥');
                        }
                        
                        
                    })
                    .catch(function(error) {
                        msg.channel.send("Hmm, kayaknya ada yang salah: " + error);
                    });
                    
                    
                    
                } 
            } else {
                msg.channel.send('<@' + msg.author.id + '> maaf, datanya gak ada. Coba cek lagi Pilot ID NVirtual-nya (-д-；)');
            }
            
        })
        .catch(function(error) {
            msg.channel.send("Hmm, kayaknya ada yang salah: " + error);
        });
    }
}

exports['profile'] = {
    usage: '<Pilot ID>',
    description: 'Lihat profil NVirtual',
    process: function(bot, msg, suffix) {
        // variable to hold matches
        
        
        // get pilotID to search
        var pilotID = suffix.split(' ')[0];
        // get search string
        // var searchString = suffix.slice(pilotID.length + 1);
        // var searchRegex = new RegExp(searchString, 'i');
        // pull the data of the pilotID in question
        var pilotID = pilotID.replace(/\D/g,'');
        var restString = process.env.PILOTS_API + '/' + pilotID ;
        var data;
        rp(restString, auth)
        .then(function(response) {
            if (suffix) {
                data = JSON.parse(response);
                
                if(pilotID.length == 1) {
                    pilotID = '00' + pilotID;
                } else if(pilotID.length == 2){
                    pilotID = '0' + pilotID;
                }
                
                if(data) {
                    var nickname = 'NVX' + pilotID + ' | ' + data.firstname + ' ' + data.lastname;
                    
                    let embed = new Discord.RichEmbed()
                    .setAuthor(nickname, msg.author.avatarURL, "https://crew.nvirtual.net/index.php/profile/view/NVX" + pilotID)
                    .setColor('#FF6600')
                    .setDescription("Profil Akun NVirtual")
                    .setThumbnail(url=data.picture)
                    .addField('Rank', data.rank)
                    .addField('Flight Hours', data.totalhours + ' hours')
                    .addField('Total Flights', data.totalflights + ' flights')
                    .setFooter("NVirtual Crew", "https://nvirtual.net/img/bulet-64.png");
                    
                    msg.channel.send({embed : embed});
                } else {
                    msg.channel.send('<@' + msg.author.id + '> maaf, datanya gak ada. Coba cek lagi Pilot ID NVirtual-nya (-д-；)')
                }
            } else {
                msg.channel.send('<@' + msg.author.id + '> maaf, kayaknya salah ketik. Coba ketik !profile sama NVirtual Pilot ID Anda (＾＾)ｂ. Misalnya: !profile NVX002')
            }
            
            
        })
        .catch(function(error) {
            msg.channel.send("Hmm, kayaknya ada yang salah: " + error);
        });
        
    }
}
