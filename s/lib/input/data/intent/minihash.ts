
export function minihash(hash: string) {
	return Number.parseInt(hash.slice(0, 8), 16)
}

