require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, IntentsBitField, Collection } = require('discord.js');
const { Player, useMainPlayer } = require('discord-player');

const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
});

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.player = new Player(client);

// this event is emitted whenever discord-player starts to play a track
client.player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    //queue.metadata.channel.send(`Started playing **${track.title}**!`);
});

client.on("ready", async () => {
    await client.player.extractors.loadDefault();

    // Get all ids of the servers 
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version: '9'}).setToken(process.env.BOT_KEY);

    for(const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild' + guildId))
        .catch(console.error);
    }
});

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command"});
    }
});

const useChatGPT = require('./chatGPT.js');

client.on("messageCreate", async (message) => {
    if(message.author.bot) return;
    if(!message.mentions.users.has(client.user.id)) return;
    useChatGPT(client, message);
});

client.login(process.env.BOT_KEY);