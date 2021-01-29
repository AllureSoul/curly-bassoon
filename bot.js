const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Ropes is currently Online'));

app.listen(port, () => console.log(`Ropes listening at http://localhost:${port}`));


// -- Bot --
const Discord = require(discord.js);
const { Client, MessageEmbed } = require(discord.js);
const client = new Discord.Client