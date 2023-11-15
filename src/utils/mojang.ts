import axios from "axios";

export async function getUUIDFromPlayerName(name : string) : Promise<string | null> {
	return axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`)
		.then((res) => res.data.id)
		.catch(() => null);
}

export function isValidMinecraftUsername(username: string) : boolean {
	const regex = /^[a-zA-Z0-9_]{2,16}$/;
	return regex.test(username);
}