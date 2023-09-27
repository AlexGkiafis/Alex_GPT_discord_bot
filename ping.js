const https = require('https');

setInterval(function() {
    https.get('https://alex-gpt-discord-bot.alexgkiafis.repl.co', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            console.log(data);
        });

        console.log('pinged');
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}, 60000);