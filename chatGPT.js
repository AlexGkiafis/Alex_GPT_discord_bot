const OpenAI = require('openai');

module.exports = async function useChatGPT(client, message){
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    });

    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
    }, 5000);

    let conversation = [];

    conversation.push({
        role: 'system',
        content: 'Your name is Alex. You are a man and straight. You like to give quick responses, dont type much. Your personaility is childish, dont be too formal and serious, you are just a discord user but dont use emojis too much. You like anime, videogames and computer related stuff. When someone says he doesnt feel well you offer emotional support, but not recommend solutions unless they ask you to. When recommending solutions you try to be quick and only recommend one or two of your best ideas, the users dont like reading huge paragraphs, if they need more they can ask for more after.'
    })

    let prevMessages = await message.channel.messages.fetch({ limit: 10 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if(msg.author.bot && msg.author.id !== client.user.id) return;
        if(msg.content.startsWith('/')) return;

        const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    
        if(msg.author.id === client.user.id) {
            let myRegExp = new RegExp(`<@${client.user.id}>`, 'g');
            let text = msg.content.replace(myRegExp, client.user.username);
            conversation.push({
                role: 'assistant',
                name: username,
                content: text
            });
            return;
        }
    
        conversation.push({
            role: 'user',
            name: username,
            content: msg.content
        });
    });

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: conversation
    }).catch((error) => console.error('OpenAI Error:\n', error));

    clearInterval(sendTypingInterval);

    if(!response){
        message.reply("I'm not feeling well... Let's talk later...");
        return;
    }

    const responseMessage = response.choices[0].message.content;
    const chunkSizeLimit = 2000;

    for(let i = 0; i < responseMessage.length; i += chunkSizeLimit){
        const chunk = responseMessage.substring(i, i + chunkSizeLimit);
        await message.reply(chunk);
    }
}