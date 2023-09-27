const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song."),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guild);
        
        if(!queue){
            await interaction.reply("There is no song playing.");
            return;
        }
        
        const currentSong = queue.currentTrack;
    
        queue.node.skip();
    
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Skipped **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}