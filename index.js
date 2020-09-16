const DISCORD = require('discord.js'),
    CLIENT = new DISCORD.Client(),
    CONFIG = require('./config.json'),
    FS = require('fs')
const PREFIX = CONFIG.prefix;
CLIENT.db = require('./db.json')

CLIENT.commands = new DISCORD.Collection()

FS.readdir('./commands', (err, files) => {
    if(err) throw err
    files.forEach(file => {
        if(!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        CLIENT.commands.set(command.name, command)
    })
})

CLIENT.on('ready', () => {
    console.log("Le bot est lancé")
    const status = [
        () => `${CLIENT.guilds.cache.size} serveurs`,
        () => `${CLIENT.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`
    ]
    let i = 0
    setInterval(() => {
        const [bots, humans] = CLIENT.guilds.cache.first().members.cache.partition(member => member.user.bot)
        CLIENT.channels.cache.get(CONFIG.serverStats.member).setName(`🙋 Joueurs : ${humans.size}`)
        CLIENT.channels.cache.get(CONFIG.serverStats.bots).setName(`🤖 Bots : ${bots.size}`)
        CLIENT.channels.cache.get(CONFIG.serverStats.total).setName(`📈 Total : ${CLIENT.guilds.cache.first().memberCount}`)
    }, 10e3)
    setInterval(() => {
        CLIENT.user.setActivity(status[i](), {type: "PLAYING"})
        i = ++i % status.length
    }, 1e4)
})

CLIENT.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(CONFIG.greeting.channel).send(new DISCORD.MessageEmbed()
        .setDescription(`${member}, a rejoint le serveur. Nous sommes désormais ${member.guild.memberCount} membres ! :tada:`)
        .setColor('#00ff00'))
    member.roles.add(CONFIG.greeting.role.membertitle)
    member.roles.add(CONFIG.greeting.role.member)
})

CLIENT.on('guildMemberRemove', member => {
   member.guild.channels.cache.get(CONFIG.greeting.channel).send(new DISCORD.MessageEmbed()
       .setDescription(`**${member.user.tag.substring(0, member.user.tag.length-5)}** a quitté le serveur. Nous passons à ${member.guild.memberCount} membres ! :cry: `)
       .setColor('#ff0000'))
})

CLIENT.on('message', message => {
    if(message.type !== 'DEFAULT' || message.author.bot) return

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if(!commandName.startsWith(CONFIG.prefix))return
    const command = CLIENT.commands.get(commandName.slice(CONFIG.prefix.length))
    if(!command)return
    if(command.guildOnly && !message.guild)return message.channel.send("Cette commande n'est utilisable que dans un serveur !")

    command.run(message, args, CLIENT)
})

CLIENT.login(CONFIG.token)