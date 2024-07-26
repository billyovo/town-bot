import { LogisticRegressionClassifier } from "natural";
import path from "path";
import { logger } from "../../logger/logger";

export function getPromotionClassifier(): Promise<LogisticRegressionClassifier | null> {
	return new Promise((resolve, _) => {
		const classifierPath = path.resolve(__dirname, "../../../assets/classifier.json");
		LogisticRegressionClassifier.load(classifierPath, null, (err, classifier: LogisticRegressionClassifier | undefined) => {
			if (!err && classifier) {
				resolve(classifier);
			}
			else {
				logger.error("Failed to load classifier");
				resolve(null);
			}
		});
	});
}