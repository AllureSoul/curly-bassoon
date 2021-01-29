const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Ropes is currently Online'));

app.listen(port, () => console.log(`Ropes listening at http://localhost:${port}`));


// -- Bot Login --
const Discord = require("discord.js");
const { Client, MessageEmbed } = require("discord.js");
const client = new Discord.Client
client.login(process.env.DISCORD_TOKEN)

// -- Bot --
client.on('ready', () => {
	console.log(`I'm ready!`);
	client.guilds.cache.get('791720839275741194').channels.cache.get('791723808980598784').send('I Am Online!')
	client.user.setActivity("Your Game (^w^)/", {type: 'WATCHING' });
	