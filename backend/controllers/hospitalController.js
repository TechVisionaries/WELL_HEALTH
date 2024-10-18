import Hospital from "../models/hospitalModel.js";
import Doctor from "../models/doctorModel.js";

// get hospitals by sector
export const getHospitalsBySector = async (req, res) => {
  const { sector } = req.params;

  try {
    const hospitals = await Hospital.find({
      sector,
    });

    return res.status(200).json(hospitals);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
};


// get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();

    return res.status(200).json(hospitals);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
};

// get doctor by hospital
export const getDoctorsByHospital = async (req, res) => {
  
  // get hospital name as query parameter
  const {hospitalName} = req.query;
  console.log(hospitalName);

  try {
    // populate doctors in hospital
    const hospital = await Hospital.findOne({name: hospitalName}).populate("doctors");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    return res.status(200).json(hospital.doctors);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
};

// get hospital by name
export const getHospitalByName = async (req, res) => {
  const {name} = req.query;

  try {
    const hospital = await Hospital.findOne({name});
    
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    return res.status(200).json(hospital);
  }
  catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching hospital", error: error.message });
  }
}