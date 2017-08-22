const SIZE = 8

const fields =  [
	{
		name: 'help (page/topic)',
		value: 'Display the command list or get information about a particular command.',
		extValue: 'What else do you want to know?'
	},
	{
		name: 'configure [key/command] (value)',
		value: 'Change a value of a config variable. Admin only.',
		extValue: 'Config values hold server-specific information such as the admin role name or prefix. Cannot be changed in DMs.'
	},
	{
		name: 'factions [command] (value)',
		value: 'Get data from the faction summary.',
		extValue: 'The commands are: `online`'
	}
]

export function help(msg) {
	return new Promise(resolve => {
		let [topic] = msg.content.split(/\s+/g).slice(1)

		if(!topic) {
			topic = 1
		}

		if(parseInt(topic)) {
			topic = parseInt(topic)
		}

		let max = Math.ceil(fields.length / SIZE)

		let displayedFields = []


		if(typeof topic !== 'number') {
			let command = fields.find(el => {
				if(el.name.startsWith(topic)) {
					return el
				}
			})

			if(command) {
				command.value += ' ' + command.extValue
				displayedFields[0] = command
			}
		}
		else {
			//Trim fields into pages.
			let n = 0
			displayedFields = fields.map((field, i) => {
				if(i >= (topic-1) * SIZE) {
					if(n < SIZE) {
						n++
						return field
					}
				}
			})
		}

		if(!displayedFields[0]) {
			throw new Error(`${topic} - not found.`)
		}

		msg.channel.send({embed: {
			color: 0xE057F2,
			description: `Architect Command List (${topic}/${max})`,
			fields: displayedFields
		}})
	}).catch(err => {
		msg.channel.send(`${err.name}: ${err.message}`)
	})
}
