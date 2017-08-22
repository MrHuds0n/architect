import Discord from 'discord.js'
import PersistentCollection from 'djs-collection-persistent'

import secret from './secret'
import defaults from './defaults'

import {
	isAdmin,
	isMod,
	getOnlinePlayers,
	formatPlayerList
} from './util'

import { configure, help, factions } from './commands'

import { persistentPlayerlist } from './processes'

export const client = new Discord.Client()
let config = new Promise((resolve) => {
	resolve(new PersistentCollection({name: 'config'}))
})

client.login(secret.token)

client.on('ready', async () => {
	persistentPlayerlist()
	console.log('Ready!')
})

client.on('guildCreate', guild => {
	config.then(res => {
		res.set(guild.id, defaults)
	})
})

client.on('message', async (msg) => {
	if(msg.author.bot) return

	// eval for nasty
	if(msg.author.id === secret.corile) {
		if(msg.content.startsWith('eval')) {
			try {
				const r = eval(msg.content.substr(5))
				msg.channel.send(`Evaled: \n\`\`\`${msg.content.substr(5)}\n\n> ${r}\n\`\`\``)
			}
			catch(err) {
				msg.channel.send(`${err.name}: ${err.message}`)
			}
		}
	}

	// command specs
	let loadedConfig = await config
	let guildConfig
	if(msg.channel.type !== 'dm') {
		guildConfig = loadedConfig.get(msg.guild.id)
	}
	else {
		guildConfig = defaults
	}


	if(msg.content.startsWith(guildConfig.prefix)) {
		msg.content = msg.content.substr(guildConfig.prefix.length).trim()

		if(msg.content.startsWith('help')) {
			help(msg)
		}

		if(msg.content.startsWith('factions')) {
			factions(msg)
		}

		if(msg.content.startsWith('configure')) {
			configure(msg, guildConfig)
		}
	}
})

export default config
