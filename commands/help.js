const CONFIG = require('../config.json'),
    FS = require('fs'),
    DISCORD = require('discord.js')

module.exports = {
    run: async (message, args, client) => {
        if(args[0]){
            const command = client.commands.get(args[0].toLowerCase())
            if(!command || !command.help) return message.channel.send("Cette commande n'existe pas !")
            message.channel.send(new DISCORD.MessageEmbed()
                .setDescription(`**Commande : ${command.name}**\n\n${command.help.description}\n\nSystaxe : \`${CONFIG.prefix}${command.name}${command.help.syntaxe ? ` ${command.help.syntaxe}` : ''}\``)
                .setColor("GOLD"))
        }
        else{
            message.channel.send(new DISCORD.MessageEmbed()
                .setTitle("Liste des commandes")
                .setDescription(`${client.commands.filter(command => command.help).map(command => `\`${CONFIG.prefix}${command.name}\``).join(' ')} \n\nPour plus d'informations sur une commande, tapez \`${CONFIG.prefix}help [nom de la commande]\``)
                .setColor("DARK_GOLD"))
        }
    },
    name: "help",
    help: {
        description: "Cette commande permet d'avoir de l'aide",
        syntaxe: '[nom de la commande]'
    },
    guildOnly: true
}