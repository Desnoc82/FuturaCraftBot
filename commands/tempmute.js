const parseDuration = require('parse-duration'),
    humanizeDuration = require('humanize-duration')

module.exports = {
    run: async (message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !")
        const member = message.mentions.members.first()
        if(!member)return message.channel.send("Veuillez mentionner le membre à réduire au silence !")
        if(member.id === message.guild.ownerID) return message.channel.send("Vous ne pouvez pas réduire au silence un administrateur !")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas réduire au silence ce membre !")
        if(!member.manageable)return message.channel.send("Le bot ne peux pas réduire au silence ce membre !")
        const duration = parseDuration(args[1])
        if(!duration) return message.channel.send("Veuillez indiquer une durée valide !")
        const reason = args.slice(2).join(' ') || 'Aucune raison fournie'
        let muteRole = message.guild.roles.cache.find(role => role.name === "🔇 | Muted")
        if(!muteRole){
            muteRole = await message.guild.roles.cache.create({
                data:{
                    name: "🔇 | Muted",
                    permissions: 0
                }
            })
            message.guild.channels.cache.forEach(channel => channel.createOverwrite(muteRole, {
                SEND_MESSAGES: false,
                CONNECT: false,
                ADD_REACTIONS: false
            }))
        }
        await member.roles.add(muteRole)
        message.channel.send(`**${member.user.tag.substring(0, member.user.tag.length-5)}** a été réduit au silence pendant ${humanizeDuration(duration, {language: 'fr'})} !`)
        setTimeout(() => {
            if(member.deleted || !member.manageable) return
            member.roles.remove(muteRole)
            message.channel.send(`**${member.user.tag.substring(0, member.user.tag.length-5)}** peut de nouveau parler !`)
        }, duration)
    },
    name : "tempmute",
    help: {
        description: "Permet de réduire temporairement un membre au silence",
        syntaxe: '<@membre> <durée> [raison]'
    }
}