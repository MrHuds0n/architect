import config from '../index'
import secret from '../secret'

export async function isMod(msg) {
	const res = await config
	const guildConfig = res.get(msg.guild.id)
	const mod = msg.guild.roles.find('name', guildConfig.modRole)

	if(msg.member.roles.has(mod.id) || msg.member.id === secret.corile) {
		return true
	}
	else {
		return false
	}

}
