import express from "express"
import { addVenue } from "../controllers/venueController.js";

const venueRouter = express.Router();

venueRouter.post('/add/new/venue' , addVenue);

export default venueRouter;