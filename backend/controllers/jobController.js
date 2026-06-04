import Job from "../models/Job.js";
import createOpportunityControllers from "./opportunityControllerFactory.js";

const {
  listItems: getJobs,
  getItem: getJobById,
  createItem: createJob,
  updateItem: updateJob,
  deleteItem: deleteJob
} = createOpportunityControllers(Job, {
  employmentType: "Full-time",
  experienceLevel: "Mid-level"
});

export { getJobs, getJobById, createJob, updateJob, deleteJob };
