import asyncHandler from "../middleware/asyncHandler.js";
import { buildOpportunityPayload, validateOpportunityPayload } from "./opportunityUtils.js";

const createOpportunityControllers = (Model, defaults = {}) => {
  const listItems = asyncHandler(async (_req, res) => {
    const items = await Model.find().sort({ featured: -1, createdAt: -1 });
    res.json(items);
  });

  const getItem = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Item not found.");
    }

    res.json(item);
  });

  const createItem = asyncHandler(async (req, res) => {
    const payload = buildOpportunityPayload(req.body, defaults);
    const validationError = validateOpportunityPayload(payload);

    if (validationError) {
      res.status(400);
      throw new Error(validationError);
    }

    const createdItem = await Model.create(payload);
    res.status(201).json(createdItem);
  });

  const updateItem = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Item not found.");
    }

    const payload = buildOpportunityPayload(req.body, defaults);
    const validationError = validateOpportunityPayload(payload);

    if (validationError) {
      res.status(400);
      throw new Error(validationError);
    }

    Object.assign(item, payload);
    const updatedItem = await item.save();
    res.json(updatedItem);
  });

  const deleteItem = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Item not found.");
    }

    await item.deleteOne();

    res.json({ message: "Item deleted successfully." });
  });

  return {
    listItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
  };
};

export default createOpportunityControllers;
