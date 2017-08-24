import config from '../index'
import secret from '../secret'

export async function isAdmin(msg) {
	const res = await config
	const guildConfig = res.get(msg.guild.id)
	const admin = msg.guild.roles.find('name', guildConfig.adminRole)

	if(msg.member.id === secret.corile) {
		return true
	}
	else {
		if(msg.member.roles.has(admin.id)) {
			return true
		}
		else {
			return false			
		}
	}

}
