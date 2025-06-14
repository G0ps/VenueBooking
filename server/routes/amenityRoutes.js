import express from "express"
import { addAmenity , deleteAmenity} from "../controllers/amenityController.js";

const amenityRouter = express.Router();

amenityRouter.post('/add/new/amenity' , addAmenity);
amenityRouter.post('/delete/amenity' , deleteAmenity);

export default amenityRouter;