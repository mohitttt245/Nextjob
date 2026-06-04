import OpenAI from "openai";
import asyncHandler from "../middleware/asyncHandler.js";
import InterviewCategory from "../models/InterviewCategory.js";
import { parseBoolean, parseList } from "./opportunityUtils.js";

let client;

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
};

const buildFallbackResponse = (role, difficulty, categories) => {
  const categoryNames = categories.length ? categories.map((item) => item.name) : ["General"];
  const difficultyTone = {
    beginner: "fundamentals",
    intermediate: "practical project work",
    advanced: "system design and trade-offs"
  };

  const tone = difficultyTone[difficulty] || "applied problem solving";

  return {
    source: "fallback",
    questions: {
      hr: [
        `Tell me about yourself and why you want a ${role} opportunity right now.`,
        `Describe a challenge you faced while learning or working on ${role} skills and how you handled it.`,
        `How do you prioritize work when deadlines overlap or change unexpectedly?`,
        `What type of team environment helps you do your best work, and why?`
      ],
      technical: [
        `Walk through a recent ${role} project and explain the decisions you made around ${tone}.`,
        `Which tools, frameworks, or workflows do you rely on most for ${role} work, and why?`,
        `Pick one ${categoryNames[0].toLowerCase()} concept relevant to ${role} and explain it to a junior teammate.`,
        `How would you debug a production issue in a ${role} workflow when the root cause is unclear?`
      ],
      aptitude: [
        `A task takes 6 hours and the deadline moves up by 2 days. How would you re-plan your work?`,
        `If your team improves a process by 15% each sprint, what is the impact after 4 sprints?`,
        `You receive conflicting feedback from two stakeholders. What signals would you use to decide next steps?`,
        `A user flow drops from 68% to 51% conversion after a release. What would you investigate first?`
      ]
    },
    tips: [
      `Prepare 2 concise stories that show measurable impact in ${role} work.`,
      `Review ${categoryNames.join(", ")} topics and turn each into a 60-second explanation.`,
      `Practice answering aloud so your responses stay structured at the ${difficulty} level.`,
      "Keep one STAR-format example ready for teamwork, ownership, and conflict resolution.",
      "End every answer with the result, lesson, or business impact when possible."
    ]
  };









  
};

const extractJsonFromText = (text) => {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("AI response did not contain valid JSON.");
  }

  return text.slice(firstBrace, lastBrace + 1);
};

const getInterviewCategories = asyncHandler(async (_req, res) => {
  const categories = await InterviewCategory.find().sort({ createdAt: -1 });
  res.json(categories);
});

const createInterviewCategory = asyncHandler(async (req, res) => {
  if (!req.body.name?.trim()) {
    res.status(400);
    throw new Error("Category name is required.");
  }

  const category = await InterviewCategory.create({
    name: req.body.name.trim(),
    description: req.body.description?.trim() || "",
    hrPrompt: req.body.hrPrompt?.trim() || "",
    technicalFocus: req.body.technicalFocus?.trim() || "",
    aptitudeFocus: req.body.aptitudeFocus?.trim() || "",
    sampleRoles: parseList(req.body.sampleRoles),
    isActive: typeof req.body.isActive === "undefined" ? true : parseBoolean(req.body.isActive)
  });

  res.status(201).json(category);
});

const updateInterviewCategory = asyncHandler(async (req, res) => {
  const category = await InterviewCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Interview category not found.");
  }

  category.name = req.body.name?.trim() || category.name;
  category.description = req.body.description?.trim() || category.description;
  category.hrPrompt = req.body.hrPrompt?.trim() || category.hrPrompt;
  category.technicalFocus = req.body.technicalFocus?.trim() || category.technicalFocus;
  category.aptitudeFocus = req.body.aptitudeFocus?.trim() || category.aptitudeFocus;

  if (typeof req.body.sampleRoles !== "undefined") {
    category.sampleRoles = parseList(req.body.sampleRoles);
  }

  if (typeof req.body.isActive !== "undefined") {
    category.isActive = parseBoolean(req.body.isActive);
  }

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

const deleteInterviewCategory = asyncHandler(async (req, res) => {
  const category = await InterviewCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Interview category not found.");
  }

  await category.deleteOne();

  res.json({ message: "Interview category deleted successfully." });
});

const generateInterviewQuestions = asyncHandler(async (req, res) => {
  const role = req.body.role?.trim();
  const difficulty = req.body.difficulty?.trim()?.toLowerCase() || "intermediate";

  if (!role) {
    res.status(400);
    throw new Error("Role is required to generate interview questions.");
  }

  let selectedCategories = [];

  if (Array.isArray(req.body.categories) && req.body.categories.length) {
    selectedCategories = await InterviewCategory.find({
      _id: { $in: req.body.categories },
      isActive: true
    });
  }

  if (!selectedCategories.length) {
    selectedCategories = await InterviewCategory.find({ isActive: true }).limit(4);
  }

  const fallback = buildFallbackResponse(role, difficulty, selectedCategories);
  const openAIClient = getOpenAIClient();

  if (!openAIClient) {
    res.json({
      role,
      difficulty,
      categoriesUsed: selectedCategories.map((item) => item.name),
      ...fallback
    });
    return;
  }

  const categoryContext = selectedCategories
    .map(
      (category) =>
        `Category: ${category.name}\nDescription: ${category.description}\nHR focus: ${category.hrPrompt}\nTechnical focus: ${category.technicalFocus}\nAptitude focus: ${category.aptitudeFocus}\nSample roles: ${category.sampleRoles.join(", ")}`
    )
    .join("\n\n");

  try {
    const response = await openAIClient.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "You are an interview preparation coach. Return valid JSON only with keys: hrQuestions, technicalQuestions, aptitudeQuestions, tips. Each key must map to an array of concise strings.",
      input: `Generate an interview prep set for the role "${role}" at "${difficulty}" difficulty.\n\nUse this category guidance when relevant:\n${categoryContext}\n\nRequirements:\n- 4 HR questions\n- 4 technical questions specific to the role\n- 4 aptitude questions\n- 5 preparation tips\n- Make the tone realistic for job seekers\n- Return JSON only`
    });

    const parsed = JSON.parse(extractJsonFromText(response.output_text));

    res.json({
      role,
      difficulty,
      source: "openai",
      categoriesUsed: selectedCategories.map((item) => item.name),
      questions: {
        hr: parsed.hrQuestions || fallback.questions.hr,
        technical: parsed.technicalQuestions || fallback.questions.technical,
        aptitude: parsed.aptitudeQuestions || fallback.questions.aptitude
      },
      tips: parsed.tips || fallback.tips
    });
  } catch (error) {
    console.error("OpenAI interview generation failed, using fallback:", error.message);

    res.json({
      role,
      difficulty,
      categoriesUsed: selectedCategories.map((item) => item.name),
      ...fallback
    });
  }
});

export {
  getInterviewCategories,
  createInterviewCategory,
  updateInterviewCategory,
  deleteInterviewCategory,
  generateInterviewQuestions
};
