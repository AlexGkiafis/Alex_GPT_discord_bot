const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song."),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guild);
        
        if(!queue){
            await interaction.reply("There is no song playing.");
            return;
        }
    
        queue.node.resume();
    
        await interaction.reply("The current song has been resumed.");
    }
}  