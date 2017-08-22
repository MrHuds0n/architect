import config from '../index'
import defaults from '../defaults'
import { isAdmin } from '../util'

export async function configure(msg, guildConfig) {
	const res = await config
	const [key, ...value] = msg.content.split(/\s+/g).slice(1)

	if(!(await isAdmin(msg))) {
		msg.channel.send('This command can only be used by an admin.')
		return
	}

	if(!key) {
		msg.channel.send(`You need to specify a key or command. The available keys are: \`${Object.keys(defaults)}\`. The available commands are: \`reset\`.`)
		return
	}

	if(key === 'reset') {
		if(value.join(' ')) {
			const resetKey = value.join(' ')
			if(guildConfig[resetKey]) {
				guildConfig[resetKey] = defaults[resetKey]
				res.set(msg.guild.id, guildConfig)
				msg.channel.send(`Key \`${resetKey}\` reset to factory settings.`)
			}
		}
		else {
			guildConfig = defaults
			res.set(msg.guild.id, guildConfig)
			msg.channel.send('Config reset to factory settings.')
			return
		}
		return
	}

	if(!value.join(' ')) {
		msg.channel.send(`You need to specify a value. The current value is \`${guildConfig[key]}\``)
		return
	}

	guildConfig[key] = value.join(' ')
	res.set(msg.guild.id, guildConfig)
	msg.channel.send(`Key \`${key}\` set to \`${guildConfig[key]}\``)
}
