const express = require('express');
const app = express();
const port = 42069;

app.get('/', (req, res) => res.send('Ropes is currently Online'));

app.listen(port, () =>
	console.log(`Ropes listening at http://localhost:${port}`)
);

// -- Bot Login --
const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);
const fs = require('fs');
var link = require('./Files/links.json');
var characterPath = './Files/Characters/';
var linkPath = './Files/Links/';
const footer = require('./Files/Resources/footers.json');

// -- Bot --
client.on('ready', () => {
	console.log(`I'm ready!`);
	client.user.setActivity('Online', { type: 'WATCHING' });
});

client.on('message', msg => {
	if (msg.author.bot) return;
	//if (msg.member.roles.cache.has('804889560588353576')) return;
  if (!msg.content.startsWith === ".") return;
	//Read DM Info
	var rawdata = fs.readFileSync('./Files/dminfo.json');
	let dminfo = JSON.parse(rawdata);
	//Check If File Exists
	try {
		if (fs.existsSync(`./Files/creation.txt`)) {
			return;
		}
	} catch (err) {}
	if (
		msg.content.startsWith('.tutorial') ||
		msg.content.startsWith('.help') ||
		msg.content.includes('<@!732137034805936169>')
	) {
		var rand = Math.floor(Math.random(1) * footer.length);
		const randFoot = footer[rand];
		if (!randFoot) {
			return;
		}
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#7247ff')
			.setTitle('Roleplay Bot Ropes!')
			.setAuthor('Ropes')
			.setDescription(
				`Hello! My Name Is Ropes. I'm a bot created by AllureSoul for roleplay. My Command list is the following`
			)
			.addFields(
				{ name: 'Public Commands', value: '.join\n.roll\n.registerDM' },
				{ name: 'Player Commands', value: '.leave\n.say', inline: true },
				{
					name: 'Character Commands',
					value:
						'.characters\n.characterRegister\n.characterLink\n.characterView',
					inline: true
				},
				{
					name: 'DM Commands',
					value: '\n.resignDM\n.close\n.open\n.imitate',
					inline: true
				}
			)
			.setTimestamp()
			.setFooter(`${randFoot.text}`);

		msg.channel.send(exampleEmbed);
	}
	//Admin Only
	if (msg.author.id === '582195861874802709') {
	  if(msg.content.startsWith('.forceLeave')){
	    const[command, ...argsRaw] = msg.content.split(" ")
      args = argsRaw.join(" ")
	    var id = args.slice(3, -1)
      var target = msg.guild.members.cache.get(id);
      target.roles.remove(link.rolePlayer);
      msg.reply(`${linkPath}${id}link.txt`)
      try{
        if(fs.existsSync(`${linkPath}${id}link.txt`)){
          fs.unlinkSync(`${linkPath}${id}link.txt`)
          msg.reply("Force Leave Complete.")
        }
        else msg.reply("an error has occoured")
      } catch(err){
        msg.reply("an error has occoured")
      }
	  }
		if (msg.content.startsWith('.characterDelete')) {
			const [command, ...nameraw] = msg.content.split(' ');
			var name = nameraw.join(' ');
			try {
				if (fs.existsSync(`${characterPath}${name}.txt`)) {
					fs.unlinkSync(`${characterPath}${name}.txt`);
					msg.reply(`${name} has been deleted`);
				} else msg.reply('that character does not seem to exist');
			} catch (err) {
				msg.reply('An error has occoured');
			}
		}
		if (msg.content.startsWith('.linkAdmin')) {
			const [command, rolePlayer, roleDM] = msg.content.split(' ');
			if (rolePlayer.startsWith('<@&') && rolePlayer.endsWith('>')) {
				var player = rolePlayer.slice(3, -1);
			}
			if (roleDM.startsWith('<@&') && rolePlayer.endsWith('>')) {
				var dungeonMaster = roleDM.slice(3, -1);
			}
			const guildID = msg.guild.id;
			const channelID = msg.channel.id;
			const selfID = msg.guild.members.cache.get('732137034805936169');
			let write = {
				guild: guildID,
				channel: channelID,
				self: selfID,
				rolePlayer: player,
				roleDungeon: dungeonMaster
			};
			let data = JSON.stringify(write);
			fs.writeFileSync('Files/links.json', data);
			msg.reply('Bot Successfully Linked!');
		}
		if (msg.content === '.uptime') {
			let totalSeconds = client.uptime / 1000;
			let days = Math.floor(totalSeconds / 86400);
			totalSeconds %= 86400;
			let hours = Math.floor(totalSeconds / 3600);
			totalSeconds %= 3600;
			let minutes = Math.floor(totalSeconds / 60);
			let seconds = Math.floor(totalSeconds % 60);
			msg.reply(`Uptime: ${days}d,${hours}h,${minutes}m,${seconds}s`);
		}
		if (msg.content === '.printLink') {
			msg.reply(`Guild: ${link.guild} Channel: ${link.channel}`);
		}

		if (msg.content === '.off') {
			msg.channel.send('I am die. Thank you forever').then(() => {
				console.log('Terminated.');
				process.exit(`Terminated by ${msg.author}`);
			});
		}
		if (msg.content === '.forceresign') {
			var target = msg.guild.members.cache.get(dminfo.dungeon.userID);
			target.roles.remove(link.roleDungeon);
			let dm = {
				dungeon: 'none',
				isPresent: 'no'
			};
			let dmWrite = JSON.stringify(dm);
			fs.writeFileSync('./Files/dminfo.json', dmWrite);
      fs.rmdirSync(`./Files/${dminfo.dungeon.userID}`, { recursive: true });
			msg.reply('The DM has been forcefully resigned.');
		}
	}
	if (msg.author.id === dminfo.dungeon.userID) {
    if (msg.content === '.close') {
			msg.channel.updateOverwrite(msg.guild.roles.cache.get(link.rolePlayer), {
				SEND_MESSAGES: false
			});
		}
		if (msg.content === '.open') {
			msg.channel.updateOverwrite(msg.guild.roles.cache.get(link.rolePlayer), {
				SEND_MESSAGES: true
			});
		}
    if (msg.content.startsWith(".dmLink")){
      const [command, ...nameRaw] = msg.content.split(' ');
      name = nameRaw.join(' ');
      try{
        if (fs.existsSync(`./Files/Characters/${name}.txt`)){
        console.log(`${dminfo.dungeon.userID}`)
        msg.reply ("Character Found!")
        fs.access(`./Files/${dminfo.dungeon.userID}`, (err) => {
          if (!err){
          }else{
            fs.mkdir(`./Files/${dminfo.dungeon.userID}`, (err) =>{
              if(err){
                msg.reply("An Error Has occured")
                return;
              }else
              msg.reply("Please Wait, Creating Characters Folder")
             }
            )
          }   
        })
          if (fs.existsSync(`./Files/${dminfo.dungeon.userID}/${dminfo.dungeon.userID}.txt`)){
            var id = parseInt(fs.readFileSync (`./Files/${dminfo.dungeon.userID}/${dminfo.dungeon.userID}.txt`))
            id = id + 1
            fs.writeFileSync(`./Files/${dminfo.dungeon.userID}/${dminfo.dungeon.userID}.txt`, `${id}`)
            fs.writeFileSync(`./Files/${dminfo.dungeon.userID}/${id}.txt`, `${name}`)
          } else {
            id = 1
            fs.writeFileSync(`./Files/${dminfo.dungeon.userID}/${dminfo.dungeon.userID}.txt`, `${id}`)
            fs.writeFileSync(`./Files/${dminfo.dungeon.userID}/${id}.txt`, `${name}`)
          }
          msg.reply(`${name} Has Been Linked!`)
        }else{
          msg.reply("Character does not seem to exist")
          return;
        }
      } catch(err){
        return;
      }
    }
    if (msg.content.startsWith('.dmList')){
      try{
        if(fs.existsSync(`./Files/${dminfo.dungeon.userID}/${dminfo.dungeon.userID}.txt`)){
            var linkArray = []
            var num = parseInt(fs.readFileSync(`./Files/${dminfo.dungeon.userID}/${dminfo.dungeon.userID}.txt`));
            for(i = 1; i <= num; i++){
              var file = fs.readFileSync(`./Files/${dminfo.dungeon.userID}/${i}.txt`)
              linkArray.push(`${i}. ${file}`);
            }
            msg.channel.send(
              `Linked Characters:\n\n${linkArray.join("\n")}`
            )
        }
      } catch(err){
        msg.reply("An Error has occured")
        return;
      }
    }
		if (msg.content.startsWith('.imitate')) {
			const [command, name, ...message] = msg.content.split(' ');
			const imitator = new Discord.WebhookClient(
				'804584094347821056',
				'F-imzzusDiyvaLcE9ctoo-cdKaQLuhKvrX_w0jDMmayd900Ad5bnfd3vccPal0BfFFzk'
			);
			imitator.name = name;
			imitator.send(message.join(' '));
		}
    		if (msg.content.startsWith('.dmSay')) {
			const [command, id, ...message] = msg.content.split(' ');
			const imitator = new Discord.WebhookClient(
				'804584094347821056',
				'F-imzzusDiyvaLcE9ctoo-cdKaQLuhKvrX_w0jDMmayd900Ad5bnfd3vccPal0BfFFzk'
			);
      try{
        var max = parseInt(fs.readFileSync(`./Files/${dminfo.dungeon.userID}/${dminfo.dungeon.userID}.txt`))
        if(id > max){
          msg.reply("That id does not exist!")
          return;
        }  
      } catch(err){
        msg.reply("An error has occured")
        return;
      }
      name = fs.readFileSync(`./Files/${dminfo.dungeon.userID}/${id}.txt`)
			imitator.name = name;
			imitator.send(message.join(' '));
		}
	}
	if (msg.content.startsWith('.roll')) {
		const [command, ...args] = msg.content.split(' ');
		if (!args) return;
		var roll = Math.floor(Math.random(1) * args + 1);
		msg.reply(roll);
	}
	if (msg.content === '.join') {
		var target = msg.guild.members.cache.get(msg.author.id);
		if (!target.roles.cache.has(link.rolePlayer)) {
			target.roles.add(link.rolePlayer);
			msg.reply('You are added to the game!');
		} else msg.reply("You're already in the game! go have fun!");
	}
	if (msg.content === '.registerDM') {
		var target = msg.guild.members.cache.get(msg.author.id);
		if (dminfo.isPresent === 'no') {
			target.roles.add(link.roleDungeon);
			msg.reply('You are now the DM');
			let dm = {
				dungeon: target,
				isPresent: 'yes'
			};
			let dmWrite = JSON.stringify(dm);
			fs.writeFileSync('./Files/dminfo.json', dmWrite);
			console.log(dminfo);
		} else
			msg.reply(
				`You can't be the DM! ${dminfo.dungeon.displayName} is already the DM!`
			);
	}
	if (msg.content === '.resignDM') {
		var target = msg.guild.members.cache.get(msg.author.id);
		if (dminfo.dungeon.userID === msg.author.id) {
			target.roles.remove(link.roleDungeon);
			msg.reply('You are no longer the DM');
			let dm = {
				dungeon: 'none',
				isPresent: 'no'
			};
			let dmWrite = JSON.stringify(dm); 
			fs.writeFileSync('./Files/dminfo.json', dmWrite);
      fs.rmdirSync(`./Files/${dminfo.dungeon.userID}`, { recursive: true });
		} else msg.reply('You are not the DM.');
	}
  		if (msg.content.startsWith('.characterRegister')) {
			let filter = m => m.author.id === msg.author.id;
			const [command, ...nameRaw] = msg.content.split(' ');
			name = nameRaw.join(' ');
			if (!name) {
				msg.reply('Please choose a name');
				return;
			}
			var target = msg.guild.members.cache.get(msg.author.id);
			//target.roles.add(`804889560588353576`);
			fs.writeFileSync(`./Files/creation.txt`);
			fs.writeFileSync(`${characterPath}${name}.txt`, `Name: ${name}`);
			var register = msg.author.id;
			msg.reply('Please choose an age for your character').then(() => {
				msg.channel
					.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
					.then(message => {
						age = message.first().content;
						fs.appendFileSync(`${characterPath}${name}.txt`, `\nAge: ${age}`);
						msg.reply('Please choose a class for your character').then(() => {
							msg.channel
								.awaitMessages(filter, {
									max: 1,
									time: 30000,
									errors: ['time']
								})
								.then(message => {
									vclass = message.first().content;
									fs.appendFileSync(
										`${characterPath}${name}.txt`,
										`\nClass: ${vclass}`
									);
									msg
										.reply("Please write down your character's personality")
										.then(() => {
											msg.channel
												.awaitMessages(filter, {
													max: 1,
													time: 30000,
													errors: ['time']
												})
												.then(message => {
													personality = message.first().content;
													fs.appendFileSync(
														`${characterPath}${name}.txt`,
														`\nPersonality: ${personality}`
													);
													msg
														.reply(
															'Please write down the alignment of your character.'
														)
														.then(() => {
															msg.channel
																.awaitMessages(filter, {
																	max: 1,
																	time: 30000,
																	errors: ['time']
																})
																.then(message => {
																	alignment = message.first().content;
																	fs.appendFileSync(
																		`${characterPath}${name}.txt`,
																		`\nAligment: ${alignment}`
																	);
																	msg
																		.reply(
																			'Please write down the race of your character'
																		)
																		.then(() => {
																			msg.channel
																				.awaitMessages(filter, {
																					max: 1,
																					time: 30000,
																					errors: ['time']
																				})
																				.then(message => {
																					race = message.first().content;
																					fs.appendFileSync(
																						`${characterPath}${name}.txt`,
																						`\nRace: ${race}`
																					);
																					msg
																						.reply(
																							'Please write down the weapon your character uses.'
																						)
																						.then(() => {
																							msg.channel
																								.awaitMessages(filter, {
																									max: 1,
																									time: 30000,
																									errors: ['time']
																								})
																								.then(message => {
																									weapon = message.first()
																										.content;
																									fs.appendFileSync(
																										`${characterPath}${name}.txt`,
																										`\nWeapon: ${weapon}`
																									);
																									fs.appendFileSync(
																										`${characterPath}${name}.txt`,
																										`\nCreated By: ${
																											msg.author
																										}`
																									);
																									target.roles.remove(
																										'804889560588353576'
																									);
																									fs.unlinkSync(
																										`./Files/creation.txt`
																									);
																									msg.reply(
																										'Character Created!'
																									);
																								})
																								.catch(message => {
																									msg.channel.send(
																										'... Hello?'
																									);
																									fs.unlinkSync(
																										`${characterPath}${name}.txt`
																									);
																									fs.unlinkSync(
																										`./Files/creation.txt`
																									);
																									target.roles.remove(
																										'804889560588353576'
																									);
																								});
																						});
																				})
																				.catch(message => {
																					msg.channel.send('... Hello?');
																					fs.unlinkSync(
																						`${characterPath}${name}.txt`
																					);
																					fs.unlinkSync(`./Files/creation.txt`);
																					target.roles.remove(
																						'804889560588353576'
																					);
																				});
																		});
																})
																.catch(message => {
																	msg.channel.send('... Hello?');
																	fs.unlinkSync(`${characterPath}${name}.txt`);
																	fs.unlinkSync(`./Files/creation.txt`);
																	target.roles.remove('804889560588353576');
																});
														});
												})
												.catch(message => {
													msg.channel.send('... Hello?');
													fs.unlinkSync(`${characterPath}${name}.txt`);
													fs.unlinkSync(`./Files/creation.txt`);
													target.roles.remove('804889560588353576');
												});
										});
								})
								.catch(message => {
									msg.channel.send('... Hello?');
									fs.unlinkSync(`${characterPath}${name}.txt`);
									fs.unlinkSync(`./Files/creation.txt`);
									target.roles.remove('804889560588353576');
								});
						});
					})
					.catch(message => {
						msg.channel.send('... Hello?');
						fs.unlinkSync(`${characterPath}${name}.txt`);
						fs.unlinkSync(`./Files/creation.txt`);
						target.roles.remove('804889560588353576');
					});
			});
		}

	//Character Registry
	if (msg.member.roles.cache.has(link.rolePlayer)) {
		if (msg.content.startsWith('.characterView')) {
			const [command, ...nameRaw] = msg.content.split(' ');
			name = nameRaw.join(' ');
			try {
				if (fs.existsSync(`${characterPath}${name}.txt`)) {
					var rawCharacter = fs.readFileSync(`${characterPath}${name}.txt`);
					msg.channel.send(`${rawCharacter}`);
				}
			} catch (err) {
				msg.reply("Sorry, that character doesn't seem to exist");
			}
		}
		if (msg.content.startsWith('.characterLink')) {
			const [command, ...nameLink] = msg.content.split(' ');
			name = nameLink.join(' ');
			try {
				if (fs.existsSync(`${characterPath}${name}.txt`)) {
					fs.writeFileSync(`${linkPath}${msg.author.id}link.txt`, name);
					msg.reply('Linked');
				} else msg.reply("Sorry, that character doesn't seem to exist");
			} catch (err) {
				msg.reply("Sorry, that character doesn't seem to exist");
			}
		}
		if (msg.content === '.leave') {
			var target = msg.guild.members.cache.get(msg.author.id);
			target.roles.remove(link.rolePlayer);
			msg.reply('You have been removed from the game');
			try {
				if (fs.existsSync(`${linkPath}${msg.author.id}link.txt`)) {
					fs.unlinkSync(`${linkPath}${msg.author.id}link.txt`);
				}
			} catch (err) {
				msg.reply('Error in character file deletion');
			}
		}

		if (msg.content.startsWith('.say')) {
			const [command, ...message] = msg.content.split(' ');
			const character = new Discord.WebhookClient(
				'804726357803401257',
				'xVEYa6DriKSENvlYyCgNCBcSblIHt3KEAklUIl7XgYQ3ftbsDglCxdtPUaOi9TcdtHfx'
			);
			try {
				if (fs.existsSync(`${linkPath}${msg.author.id}link.txt`)) {
					name = fs.readFileSync(`${linkPath}${msg.author.id}link.txt`);
					character.name = name.toString();
					character.send(`${message.join(' ')}`);
					msg.delete();
				} else
					msg.reply(
						'You have not linked yourself with a character! please setup a link with an existing character!'
					);
			} catch (err) {
				msg.reply(
					'You have not linked yourself with a character! please setup a link with an existing character!'
				);
			}
		}
		if (msg.content === '.characters') {
			characterArray = [];
			fs.readdirSync(characterPath).forEach(file => {
				characterArray.push(file.slice(0, -3));
			});
			msg.channel.send(
				`Characters:\n${characterArray.join(
					'\n'
				)}\nUse the command ".characterView" to view details`
			);
		}
	}
});
