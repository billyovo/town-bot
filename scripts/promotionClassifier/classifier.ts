import { LogisticRegressionClassifier } from "natural";
import trainingData from "./data/promotions.json";
import { logger } from "~/src/lib/logger/logger";

type ClassifierTrainingData = {
    text: string,
    label: string
}

export function trainClassifier() {
	const classifier = new LogisticRegressionClassifier();

	trainingData.sort(() => Math.random() - 0.5);
	for (const data of trainingData) {
		const { text, label } = data as ClassifierTrainingData;
		classifier.addDocument(text, label);
	}

	classifier.train();

	classifier.save("./src/assets/classifier.json", function(err : Error | null) {
		if (err) {
			logger.error(err);
		}
		else {
			logger.info("Classifier trained and saved");
		}
	});
}

trainClassifier();