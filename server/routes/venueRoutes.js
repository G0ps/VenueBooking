import express from "express"
import { addVenue, deleteVenue , updateVenue} from "../controllers/venueController.js";

const venueRouter = express.Router();

venueRouter.post('/add/new/venue' , addVenue);
venueRouter.patch('/update/venue' , updateVenue);
venueRouter.post('/delete/venue' , deleteVenue);

export default venueRouter;