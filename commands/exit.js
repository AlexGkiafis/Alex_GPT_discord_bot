const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Exits the Voice channel."),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guild);
        
        if(!queue){
            await interaction.reply("There is no song playing.");
            return;
        }
    
        queue.delete();
    
        await interaction.reply("Why you bully me?");
    }
}  