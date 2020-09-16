const DISCORD = require('discord.js')
module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission('KICK_MEMBERS'))return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !")
        const member = message.mentions.members.first()
        if(!member)return message.channel.send("Veuillez mentionner le membre à exclure !")
        if(member.id === message.guild.ownerID) return message.channel.send("Vous ne pouvez pas exclure un administrateur !")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas exclure ce membre !")
        if(!member.kickable)return message.channel.send("Le bot ne peux pas exclure ce membre !")
        const reason = args.slice(1).join(' ') || 'Aucune raison fournie'
        await member.kick(reason)
        message.channel.send(`**${member.user.tag.substring(0, member.user.tag.length-5)}** a été exclu pour ${reason} !`)
    },
    name : "kick",
    help: {
        description: "Permet d'exclure un membre",
        syntaxe: '<@membre> [raison]'
    },
    guildOnly : true
}