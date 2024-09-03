"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainClassifier = void 0;
const natural_1 = require("natural");
const promotions_json_1 = __importDefault(require("./data/promotions.json"));
const logger_1 = require("~/src/lib/logger/logger");
function trainClassifier() {
    const classifier = new natural_1.LogisticRegressionClassifier();
    promotions_json_1.default.sort(() => Math.random() - 0.5);
    for (const data of promotions_json_1.default) {
        const { text, label } = data;
        classifier.addDocument(text, label);
    }
    classifier.train();
    classifier.save("./src/assets/classifier.json", function (err) {
        if (err) {
            logger_1.logger.error(err);
        }
        else {
            logger_1.logger.info("Classifier trained and saved");
        }
    });
}
exports.trainClassifier = trainClassifier;
trainClassifier();
