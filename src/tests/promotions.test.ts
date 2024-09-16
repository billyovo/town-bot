import { LogisticRegressionClassifier } from "natural";
import trainingData from "../../scripts/promotionClassifier/data/promotions.json";

// do a 80/20 split of the data
const trainingDataLength = trainingData.length;
const trainingDataSplitLen = Math.floor(trainingDataLength * 0.9);
const trainingDataSplitIndex = trainingDataSplitLen - 1;

// shuffle the data
trainingData.sort(() => Math.random() - 0.5);

// split the data
const trainingDataSplit = trainingData.slice(0, trainingDataSplitIndex);
const testingDataSplit = trainingData.slice(trainingDataSplitIndex, trainingDataLength);

// train the classifier
const classifier = new LogisticRegressionClassifier();
trainingDataSplit.forEach((data) => classifier.addDocument(data.text, data.label));
classifier.train();

test("Promotion classifier", () => {

	// test the classifier with the testing split
	const results = testingDataSplit.map((data) => classifier.classify(data.text));
	const correctResults = testingDataSplit.map((data) => data.label);

	// calculate the accuracy
	const correctResultsCount = results.filter((result, index) => result === correctResults[index]).length;
	console.log(testingDataSplit.map((data, index) => `${data.text} - \r\n Classified: ${results[index]} \r\n Correct: ${correctResults[index]}\r\n\r\n`));
	const accuracy = correctResultsCount / results.length;

	console.log(accuracy);
	expect(accuracy).toBeGreaterThanOrEqual(0.8);
});