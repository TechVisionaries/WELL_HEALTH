// test/healthCardRoutes.test.js

import express from "express";
import mongoose from "mongoose";
import request from "supertest";
import healthCardRoutes from "./../../routes/healthCardRoutes"; // Adjust the import path accordingly

// Set up an Express app for testing
const app = express();
app.use(express.json());
app.use("/api/health_card", healthCardRoutes);

beforeAll(async () => {
  const mongoUri =
    "mongodb+srv://visionariestech4:93bYNJBIS9AdOlPP@hms.hdzql.mongodb.net/TEST_HMS?retryWrites=true&w=majority"; // Use a test database
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
      const userId = "62a1c6e08bbed00110c5b9e7"; // Example userId
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

      expect(res.status).toBe(404); // Expecting 404 as no userId is passed
    });
  });
});
