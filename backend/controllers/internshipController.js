import Internship from "../models/Internship.js";
import createOpportunityControllers from "./opportunityControllerFactory.js";

const {
  listItems: getInternships,
  getItem: getInternshipById,
  createItem: createInternship,
  updateItem: updateInternship,
  deleteItem: deleteInternship
} = createOpportunityControllers(Internship, {
  employmentType: "Internship",
  experienceLevel: "Entry-level"
});

export {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
};
