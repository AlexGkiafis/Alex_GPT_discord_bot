const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song."),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guild);
        
        if(!queue){
            await interaction.reply("There is no song playing.");
            return;
        }
    
        queue.node.pause();
    
        await interaction.reply("The current song has been paused.");
    }
}  