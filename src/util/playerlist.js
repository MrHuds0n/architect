import secret from '../secret'
import fetch from 'node-fetch'

const API = 'http://api.discoverygc.org/api/Online'

export async function getOnlinePlayers() {
	return fetch(`${API}/GetPlayers/${secret.api}`).then(res => {
		return res.json()
	}).then(json => {
		return JSON.parse(json)
	}).catch(err => {
		return `${err.name}: ${err.message}`
	})
}

export async function getFactionSummary() {
	return fetch(`${API}/GetFactionSummary/${secret.api}`).then(res => {
		return res.json()
	}).then(json => {
		return JSON.parse(json)
	}).catch(err => {
		return `${err.name}: ${err.message}`
	})
}

export function formatPlayerList(list) {
	if(list.Error) return

	let embed = {
		title: `${list.Players.length} players`,
		timestamp: new Date()
	}

	const sorted = list.Players.sort((a, b) => {
		return (a.System > b.System) ? 1 : -1
	})

	let players = sorted.reduce((acc, player) => {
		return acc + `${player.Name}\n`
	}, '')

	let systems = sorted.reduce((acc, player) => {
		return acc + `${player.System}\n`
	}, '')

	embed.fields = [
		{
			name: 'Player',
			value: players,
			inline: true
		},
		{
			name: 'System',
			value: systems,
			inline: true
		}
	]

	return embed
}
