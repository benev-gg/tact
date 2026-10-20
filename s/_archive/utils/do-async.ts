
export async function doAsync<Ret>(fn: () => Promise<Ret>) {
	return fn()
}

