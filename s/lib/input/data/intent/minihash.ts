
/** to help keep network packets compact, we shrink the full hash into a u32. */
export function minihash(hash: string) {
	return Number.parseInt(hash.slice(0, 8), 16)
}

