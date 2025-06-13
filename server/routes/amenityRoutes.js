import express from "express"
import { addAmenity } from "../controllers/amenityController.js";

const amenityRouter = express.Router();

amenityRouter.post('/add/new/amenity' , addAmenity);

export default amenityRouter;