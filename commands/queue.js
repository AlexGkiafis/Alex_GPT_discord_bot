const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the first 10 songs in the queue."),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guild);

        if(!queue || !queue.node.isPlaying()) {
            await interaction.reply("There is no song playing.");
            return;
        }

        const queueString = queue.tracks.toJSON().slice(0, 10).map((song, i) => {
            return `${i + 1})  [${song.duration}]\`${song.title}\` - <@${song.requestedBy.id}>`;
        }).join("\n");
    
        const currentSong = queue.currentTrack;
    
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`**Currently Playing:**\n\`${currentSong.title}\` - <@${currentSong.requestedBy.id}>\n\n**Queue:**\n${queueString}`)
                .setThumbnail(currentSong.thumbnail)
            ]
        });
    }
}