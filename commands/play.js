const { SlashCommandBuilder, embedLength } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js"); 
const { QueryType } = require("discord-player");
const { addTimes } = require("./../timesAddition.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Searches for a song.")
                .addStringOption(option =>
                    option
                        .setName("searchterms")
                        .setDescription("search keywords")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("Plays playlist from YT")
                .addStringOption(option =>
                    option
                        .setName("url")
                        .setDescription("playlist url")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Plays song from YT")
                .addStringOption(option =>
                    option
                        .setName("url")
                        .setDescription("url of the song")
                        .setRequired(true)
                )
        ),
    execute: async ({client, interaction}) => {
        if(!interaction.member.voice.channel){
            await interaction.reply("You must be in a voice channel to use this command.");
            return;
        }

        let queue = await client.player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.member.voice.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user,                
            },
            selfDeaf: true,
            volume: 80,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            leaveOnEnd: true,
            leaveOnEndCooldown: 300000,
        });

        if(!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder();

        await interaction.deferReply();

        if(interaction.options.getSubcommand() === "song")
        {
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                fallbackSearchEngine: QueryType.YOUTUBE_SEARCH
            });
        
            if(result.tracks.length == 0)
            {
                await interaction.editReply("No results found");
                return;
            }
        
            const song = result.tracks[0]
            await queue.addTrack(song);
        
            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
        }
        else if(interaction.options.getSubcommand() === "playlist")
        {
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                fallbackSearchEngine: QueryType.YOUTUBE_PLAYLIST
            });
        
            if(result.tracks.length == 0)
            {
                await interaction.editReply("No playlist found");
                return;
            }

            const playlist = result.tracks[0].playlist;
            await queue.addTrack(result.tracks);
            
            let duration = "00:00";
            playlist.tracks.forEach((track) => {
                duration = addTimes(duration, track.duration);
            });

            console.log(playlist);
        
            embed
                .setDescription(`Added **[${playlist.title}](${playlist.url})** to the queue.`)
                .setThumbnail(result.tracks[0].thumbnail)
                .setFooter({text: `Duration: ${duration}`});
        }
        else if(interaction.options.getSubcommand() === "search")
        {
            let url = interaction.options.getString("searchterms");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                fallbackSearchEngine: QueryType.YOUTUBE_SEARCH
            });
        
            if(result.tracks.length == 0)
            {
                await interaction.editReply("No results found");
                return;
            }
        
            const song = result.tracks[0];
            await queue.addTrack(song);
            
            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
        }

        await interaction.editReply({
            embeds: [embed]
        });

        if (!queue.isPlaying()) await queue.node.play();
    }
}
