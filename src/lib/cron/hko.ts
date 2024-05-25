import axios from "axios";

export async function callhko() {
	const config = {
		url: "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?",
		method: "get",
		params: {
			dataType: "fnd",
			lang: "en",
		},
	};
	const response = await axios(config);
	return response;
}
