const FS = require('fs'),
    DISCORD = require('discord.js')

module.exports = {
    run: async (message, args, client) => {
        const channel = message.mentions.channels.first() || message.channel
        if(!client.db.tickets[channel.id]) return message.channel.send('Ce salon n\'est pas un ticket !')
        if(!message.member.hasPermission("MANAGE_MESSAGES") && client.db.tickets[channel.id].author !== message.author.id) return message.channel.send("Vous n'avez pas la permission de fermer le ticket !")
        delete client.db.tickets[channel.id]
        FS.writeFileSync('./db.json', JSON.stringify(client.db))
        message.channel.send(`Le ticket ${channel.name} à été fermé`)
        channel.delete()
    },
    name: 'close',
    help: {
        description: "Permet de fermer un ticket déjà éxistant"
    },
    guildOnly: true
}