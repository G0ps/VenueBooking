import express from "express"
import { addVenue, deleteVenue } from "../controllers/venueController.js";

const venueRouter = express.Router();

venueRouter.post('/add/new/venue' , addVenue);
venueRouter.post('/delete/venue' , deleteVenue);

export default venueRouter;