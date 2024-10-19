import express from "express";
import mongoose from "mongoose";
import request from "supertest";
import healthCardRoutes from "./../../routes/healthCardRoutes"; 

// Set up an Express app for testing
const app = express();
app.use(express.json());
app.use("/api/health_card", healthCardRoutes);

beforeAll(async () => {
  const mongoUri =
    "mongodb+srv://visionariestech4:93bYNJBIS9AdOlPP@hms.hdzql.mongodb.net/TEST_HMS?retryWrites=true&w=majority"; 
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Health Card API", () => {
  // Test for creating a health card
  // describe("POST /api/health_card/create", () => {
  //   it("should create a health card for a user", async () => {
  //     const res = await request(app).post("/api/health_card/create").send({
  //       userId: "62a1c6e08bbed00110c5b9e7", // Example userId
  //       fullName: "John Doe",
  //       hospital: "City Hospital",
  //       contact: "1234567890",
  //       nic: "123456789V",
  //       emergency: "112",
  //       inssurance: "Aetna",
  //       bloodGroup: "O+",
  //       inssuranceId: "INS123",
  //       diabetes: false,
  //       bloodPressure: true,
  //       allergyDrugs: "Penicillin",
  //       diseases: "Asthma",
  //       eyePressure: false,
  //       doctorName: "Dr. Smith",
  //     });

  //     expect(res.status).toBe(200);
  //     expect(res.body.success).toBe(true);
  //     expect(res.body.message).toMatch(/Health card created and user updated/);
  //   });

  //   it("should return an error if required fields are missing", async () => {
  //     const res = await request(app).post("/api/health_card/create").send({
  //       fullName: "",
  //       hospital: "",
  //     });

  //     expect(res.status).toBe(400);
  //     expect(res.body.success).toBe(false);
  //     expect(res.body.message).toMatch(/New health card data undefined/);
  //   });
  // });

  // Test for retrieving a health card by patient ID
  describe("GET /api/health_card/get_hralth_card_by_patient_id/:userId", () => {
    it("should retrieve a health card for a given user", async () => {
      const userId = "62a1c6e08bbed00110c5b9e7"; 
      const res = await request(app).get(
        `/api/health_card/get_hralth_card_by_patient_id/${userId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/Health card retrived successfully/);
    });

    it("should return an error if no user ID is provided", async () => {
      const res = await request(app).get(
        "/api/health_card/get_hralth_card_by_patient_id/"
      );

      expect(res.status).toBe(404); 
    });
  });

  // Test for updating a health card
  //   describe("POST /api/health_card/update_health_card/:userId/:health_card_id", () => {
  //     it("should update the health card information", async () => {
  //       const res = await request(app)
  //         .post(
  //           "/api/health_card/update_health_card/62a1c6e08bbed00110c5b9e7/63b1f5e9b8e121001e3a9d8d"
  //         )
  //         .send({
  //           fullName: "Updated Name",
  //           hospital: "Updated Hospital",
  //           contact: "9876543210",
  //           emergency: "911",
  //           diabetes: true,
  //         });

  //       expect(res.status).toBe(200);
  //       expect(res.body.success).toBe(true);
  //       expect(res.body.message).toMatch(/Health card updated successfully/);
  //     });

  //     it("should return an error if the health card is not found", async () => {
  //       const res = await request(app)
  //         .post(
  //           "/api/health_card/update_health_card/62a1c6e08bbed00110c5b9e7/invalidHealthCardId"
  //         )
  //         .send({
  //           fullName: "Test Name",
  //         });

  //       expect(res.status).toBe(404);
  //       expect(res.body.success).toBe(false);
  //       expect(res.body.message).toMatch(/Health card not found for the user/);
  //     });
  //   });

  // Test for adding a prescription
  describe("POST /api/health_card/add_prescription", () => {
    it("should add a prescription for a patient", async () => {
      const res = await request(app)
        .post("/api/health_card/add_prescription")
        .send({
          userId: "62a1c6e08bbed00110c5b9e7", 
          doctorId: "62b1f5e9b8e121001e3a9d8e", 
          medicines: [
            {
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "Twice a day",
              duration: "7 days",
              instructions: "After food",
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/Prescription saved successfully/);
    });

    it("should return an error if prescription data is invalid", async () => {
      const res = await request(app)
        .post("/api/health_card/add_prescription")
        .send({
          userId: "",
          medicines: [],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid prescription data/);
    });
  });

  // Test for retrieving prescriptions by patient ID
  describe("GET /api/health_card/get_all_prescriptions/:userId", () => {
    it("should retrieve prescriptions for a given user", async () => {
      const userId = "62a1c6e08bbed00110c5b9e7"; 
      const res = await request(app).get(
        `/api/health_card/get_all_prescriptions/${userId}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/Prescription retrived successfully/);
    });

    it("should return an error if no user ID is provided", async () => {
      const res = await request(app).get(
        "/api/health_card/get_all_prescriptions/"
      );

      expect(res.status).toBe(404);
    });
  });

  // Test for retrieving all doctors
  describe("GET /api/health_card/get_all_doctors", () => {
    it("should retrieve a list of all doctors", async () => {
      const res = await request(app).get("/api/health_card/get_all_doctors");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/Doctors list/);
    });
  });

  // Test for retrieving all patients
  describe("GET /api/health_card/get_all_patients", () => {
    it("should retrieve a list of all patients", async () => {
      const res = await request(app).get("/api/health_card/get_all_patients");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/Patient list/);
    });
  });
});
