import HealthCard from "../models/healthCardModel.js";
import Prescription from "../models/prescriptionModel.js";

class ModelFactory {
  static create(modelType, data) {
    switch (modelType) {
      case "HealthCard":
        return new HealthCard(data);
      case "Prescription":
        return new Prescription(data);
      default:
        throw new Error(`Unknown model type: ${modelType}`);
    }
  }
}

export default ModelFactory;
