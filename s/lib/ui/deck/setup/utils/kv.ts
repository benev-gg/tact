
import {IdbMagazine, idbOpen, Kv} from "@e280/kv"

export async function setupKv(
		namespace: string,
		kv: Kv | undefined,
	) {

	let dispose = () => {}

	if (!kv) {
		const idb = await idbOpen(namespace, "kv")
		const magazine = new IdbMagazine(idb)
		kv = new Kv(magazine)
		dispose = () => idb.db.close()
	}

	return {kv, dispose}
}

