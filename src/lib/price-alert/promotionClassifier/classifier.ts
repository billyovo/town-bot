import { LogisticRegressionClassifier } from "natural";
import trainingData from "./data/promotions.json";

type ClassifierTrainingData = {
    text: string,
    label: string
}

export function trainClassifier(){
    const classifier = new LogisticRegressionClassifier();
    trainingData.forEach((data: ClassifierTrainingData) => {
        classifier.addDocument(data.text, data.label);
    });
    

    classifier.train();

    classifier.save('classifier.json', function(err, classifier) {
        if (err) {
            console.log(err);
        } else {
            console.log('Classifier saved!');
        }
    });
}

trainClassifier();