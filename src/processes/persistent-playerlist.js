import config from '../index'
import { client } from '../index'
import { getOnlinePlayers, formatPlayerList } from '../util'

//Set up the playerlist
export async function persistentPlayerlist() {
  //Set up the playerlist
	const loadedConfig = await config

	setInterval(updatePlayerlists, 60 * 1000)

	async function updatePlayerlists() {
		//Get playerlist
		let playerlist = await getOnlinePlayers()

		//Get all guilds
		client.guilds.map(async (guild) => {
			const guildConfig = loadedConfig.get(guild.id)

			//Search for a channel called 'playerlist' in all guilds
			const playerlistChannel = guild.channels.find(channel => {
				if(channel.name ===  guildConfig.playerlistChannel && channel.type === 'text') {
					return channel
				}
			})

			//If the channel exists, find the message with the playerlist
			if(playerlistChannel) {
				let lastMessage = await playerlistChannel.fetchMessages({limit: 1})
				lastMessage = lastMessage.array()

				//Try to edit the message
				if(lastMessage.length > 0 && lastMessage[0].editable) {
					lastMessage = lastMessage[0]
					lastMessage.edit({embed: formatPlayerList(await playerlist)})
				}
				else {
					try {
						playerlistChannel.send({embed: formatPlayerList(await playerlist)}).catch(err => {
							console.log(err)
						})
					}
					catch(err) {
						console.log(err)
					}
				}
			}
		})
	}
}
