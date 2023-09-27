const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Search for and display a GIF')
        .addStringOption(option => option
            .setName('search')
            .setDescription('Enter a search term for the GIF')
            .setRequired(true)), // You can set this to false if the parameter is optional
    async execute({client, interaction}) {
        const searchQuery = interaction.options.getString('search').split(" ").join("-");
        let url = `https://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=${process.env.GRIPHYKEY}&limit=20`; 

        try{
            await interaction.reply(`Searching for GIF with the term: ${searchQuery}`);
            let response = await fetch(url);
            let json = await response.json();
            
            if(json.data && json.data.length > 0){
                let index = Math.floor(Math.random() * json.data.length);
                await interaction.followUp(json.data[index].url);
            } else {
                await interaction.followUp('No GIFs found with that search term.');
            }
        } catch(error) {
            console.error(error);
            await interaction.followUp('There was an error processing your request.');
        }

    }
}