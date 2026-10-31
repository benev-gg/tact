
export async function setupBroadcastChannel(
		namespace: string,
		broadcastChannel: BroadcastChannel | undefined,
	) {

	let dispose = () => {}

	if (!broadcastChannel) {
		const bc = new BroadcastChannel(namespace)
		broadcastChannel = bc
		dispose = () => bc.close()
	}

	return {broadcastChannel, dispose}
}

