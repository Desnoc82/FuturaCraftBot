const CONFIG = require('../config.json'),
    FS = require('fs'),
    DISCORD = require('discord.js')
module.exports = {
    run: async (message, args, client) => {
        if(Object.values(client.db.tickets).some(ticket => ticket.author === message.author.id)) return message.channel.send("Vous avez déjà un ticket d'ouvert !")
        const channel = await message.guild.channels.create(`ticket ${message.author.username}`, {
            type: "text",
            parent: CONFIG.tickets.categorie,
            permissionOverwrites: [{
                id: message.guild.id,
                deny: "VIEW_CHANNEL"
            }, {
                id: message.author.id,
                allow: "VIEW_CHANNEL"
            }, ...CONFIG.tickets.roles.map(id => ({
                id,
                allow: "VIEW_CHANNEL"
            }))]
        })
        client.db.tickets[channel.id] = {
            author: message.author.id
        }
        FS.writeFileSync('./db.json', JSON.stringify(client.db))
        channel.send(new DISCORD.MessageEmbed()
            .setDescription(`Bonjour ${message.member}, nous allons nous occuper de vous dans les plus bref délais !`)
            .setColor('#00f0ff'))
        message.channel.send(`Votre ticket ${channel} a bien été créé !`)
    },
    name: "ticket",
    help: {
        description: "Permet d'ouvrir un ticket"
    },
    guildOnly: true
}