const MOMENT = require('moment'),
    DISCORD = require('discord.js')

MOMENT.locale('fr')

module.exports = {
    run: async (message, args, client) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES'))return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !")
        const member = message.mentions.members.first()
        if(!member)return message.channel.send("Veuillez mentionner le membre pour voir ses warns !")
        if(!client.db.warns[member.id]) return message.channel.send("Ce membre n'a aucun warn !")
        message.channel.send(new DISCORD.MessageEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL(true))
            .setDescription(`**Total de warns :** ${client.db.warns[member.id].length}\n\n__**10 derniers warns**__\n\n${client.db.warns[member.id].slice(0, 10).map((warn, i) => `*${i + 1})* ***${warn.reason}***\nSanctionné ${MOMENT(warn.date).fromNow()} par <@!${warn.mod}>`).join('\n\n')}`)
            .setColor('#ff0f00'))
    },
    name : "warnlist",
    help: {
        description: "Permet de voir tous les avertissements d'un membres",
        systaxe: '<@membre>'
    },
    guildOnly : true
}