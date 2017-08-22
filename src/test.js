let p = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve()
	}, 250)
})

(async function() {
	console.log(await p)
})()
