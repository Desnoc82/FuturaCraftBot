const parseDuration = require('parse-duration'),
    humanizeDuration = require('humanize-duration')

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission('BAN_MEMBERS'))return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !")
        const member = message.mentions.members.first()
        if(!member)return message.channel.send("Veuillez mentionner le membre à bannir !")
        if(member.id === message.guild.ownerID) return message.channel.send("Vous ne pouvez pas bannir un administrateur !")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas bannir ce membre !")
        if(!member.bannable)return message.channel.send("Le bot ne peux pas bannir ce membre !")
        const duration = parseDuration(args[1])
        if(!duration) return message.channel.send("Veuillez indiquer une durée valide !")
        const reason = args.slice(2).join(' ') || 'Aucune raison fournie'
        await member.ban({reason})
        message.channel.send(`**${member.user.tag.substring(0, member.user.tag.length-5)}** a été banni pendant ${humanizeDuration(duration, {language: 'fr'})} !`)
        setTimeout(() => {
            message.guild.members.unban(member)
            message.channel.send(`${member.user.tag} a été débanni !`)
        }, duration)
    },
    name : "tempban",
    help: {
        description: "Permet de bannir temporairement un membre",
        syntaxe: '<@membre> <durée> [raison]'
    },
    guildOnly : true
}