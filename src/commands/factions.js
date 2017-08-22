import { getOnlinePlayers, getFactionSummary, formatPlayerList } from '../util'

export async function factions(msg) {
	const [command, ...valueArray] = msg.content.split(/\s+/g).slice(1)
	const value = valueArray.join(' ')

	//Return a list of players online from all tracked factions.
	if(command === 'online') {
		//Get data from the api
		let playerlist = await getOnlinePlayers()
		if(playerlist.Error) return

		const factionlist = await getFactionSummary()
		if(factionlist.Error) return

		//Reduce the faction list to just tags
		const taglist = factionlist.Factions.map(faction => {
			return faction.Tag
		})

		//Reduce the playerlist to just players with tags.
		playerlist = playerlist.Players.map(player => {
			let tag = taglist.find(el => {
				if(player.Name.includes(el)) return el
			})

			if(tag) return {
				name: player.Name,
				tag: tag
			}
		})

		//Remove undefined elements from the array.
		playerlist = playerlist.filter(el => el !== undefined)

		//Reduce the playerlist to just the list of tags with the number of people online
		playerlist = playerlist.reduce((acc, el) => {
			let found = acc.findIndex((le) => {
				return le.tag === el.tag
			})

			if(found >= 0) {
				acc[found].value++
			}
			else {
				acc.push({tag: el.tag, value: 1})
			}

			return acc
		}, [])

		//Sort the playerlist
		playerlist = playerlist.sort((a, b) => {
			return (a.value < b.value) ? 1 : -1
		})

		//Format the embed
		const factions = playerlist.reduce((acc, el) => {
			return acc += `${el.tag}\n`
		}, '')

		const values = playerlist.reduce((acc, el) => {
			return acc += `${el.value}\n`
		}, '')

		const format = {
			title: 'Active factions',
			timestamp: new Date(),
			fields: [
				{
					name: 'Faction',
					value: factions,
					inline: true
				},
				{
					name: 'Online players',
					value: values,
					inline: true
				}
			]
		}

		console.log(format)

		msg.channel.send({embed: format})
	}
}
