// import OpenAI from "openai";
// import asyncHandler from "../middleware/asyncHandler.js";
// import InterviewCategory from "../models/InterviewCategory.js";
// import { parseBoolean, parseList } from "./opportunityUtils.js";

// let client;

// const getOpenAIClient = () => {
//   if (!process.env.OPENAI_API_KEY) {
//     return null;
//   }

//   if (!client) {
//     client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//   }

//   return client;
// };

// const buildFallbackResponse = (role, difficulty, categories) => {
//   const categoryNames = categories.length ? categories.map((item) => item.name) : ["General"];
//   const difficultyTone = {
//     beginner: "fundamentals",
//     intermediate: "practical project work",
//     advanced: "system design and trade-offs"
//   };

//   const tone = difficultyTone[difficulty] || "applied problem solving";

//   return {
//     source: "fallback",
//     questions: {
//       hr: [
//         `Tell me about yourself and why you want a ${role} opportunity right now.`,
//         `Describe a challenge you faced while learning or working on ${role} skills and how you handled it.`,
//         `How do you prioritize work when deadlines overlap or change unexpectedly?`,
//         `What type of team environment helps you do your best work, and why?`
//       ],
//       technical: [
//         `Walk through a recent ${role} project and explain the decisions you made around ${tone}.`,
//         `Which tools, frameworks, or workflows do you rely on most for ${role} work, and why?`,
//         `Pick one ${categoryNames[0].toLowerCase()} concept relevant to ${role} and explain it to a junior teammate.`,
//         `How would you debug a production issue in a ${role} workflow when the root cause is unclear?`
//       ],
//       aptitude: [
//         `A task takes 6 hours and the deadline moves up by 2 days. How would you re-plan your work?`,
//         `If your team improves a process by 15% each sprint, what is the impact after 4 sprints?`,
//         `You receive conflicting feedback from two stakeholders. What signals would you use to decide next steps?`,
//         `A user flow drops from 68% to 51% conversion after a release. What would you investigate first?`
//       ]
//     },
//     tips: [
//       `Prepare 2 concise stories that show measurable impact in ${role} work.`,
//       `Review ${categoryNames.join(", ")} topics and turn each into a 60-second explanation.`,
//       `Practice answering aloud so your responses stay structured at the ${difficulty} level.`,
//       "Keep one STAR-format example ready for teamwork, ownership, and conflict resolution.",
//       "End every answer with the result, lesson, or business impact when possible."
//     ]
//   };









  
// };

// const extractJsonFromText = (text) => {
//   const firstBrace = text.indexOf("{");
//   const lastBrace = text.lastIndexOf("}");

//   if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
//     throw new Error("AI response did not contain valid JSON.");
//   }

//   return text.slice(firstBrace, lastBrace + 1);
// };

// const getInterviewCategories = asyncHandler(async (_req, res) => {
//   const categories = await InterviewCategory.find().sort({ createdAt: -1 });
//   res.json(categories);
// });

// const createInterviewCategory = asyncHandler(async (req, res) => {
//   if (!req.body.name?.trim()) {
//     res.status(400);
//     throw new Error("Category name is required.");
//   }

//   const category = await InterviewCategory.create({
//     name: req.body.name.trim(),
//     description: req.body.description?.trim() || "",
//     hrPrompt: req.body.hrPrompt?.trim() || "",
//     technicalFocus: req.body.technicalFocus?.trim() || "",
//     aptitudeFocus: req.body.aptitudeFocus?.trim() || "",
//     sampleRoles: parseList(req.body.sampleRoles),
//     isActive: typeof req.body.isActive === "undefined" ? true : parseBoolean(req.body.isActive)
//   });

//   res.status(201).json(category);
// });

// const updateInterviewCategory = asyncHandler(async (req, res) => {
//   const category = await InterviewCategory.findById(req.params.id);

//   if (!category) {
//     res.status(404);
//     throw new Error("Interview category not found.");
//   }

//   category.name = req.body.name?.trim() || category.name;
//   category.description = req.body.description?.trim() || category.description;
//   category.hrPrompt = req.body.hrPrompt?.trim() || category.hrPrompt;
//   category.technicalFocus = req.body.technicalFocus?.trim() || category.technicalFocus;
//   category.aptitudeFocus = req.body.aptitudeFocus?.trim() || category.aptitudeFocus;

//   if (typeof req.body.sampleRoles !== "undefined") {
//     category.sampleRoles = parseList(req.body.sampleRoles);
//   }

//   if (typeof req.body.isActive !== "undefined") {
//     category.isActive = parseBoolean(req.body.isActive);
//   }

//   const updatedCategory = await category.save();
//   res.json(updatedCategory);
// });

// const deleteInterviewCategory = asyncHandler(async (req, res) => {
//   const category = await InterviewCategory.findById(req.params.id);

//   if (!category) {
//     res.status(404);
//     throw new Error("Interview category not found.");
//   }

//   await category.deleteOne();

//   res.json({ message: "Interview category deleted successfully." });
// });

// const generateInterviewQuestions = asyncHandler(async (req, res) => {
//   const role = req.body.role?.trim();
//   const difficulty = req.body.difficulty?.trim()?.toLowerCase() || "intermediate";

//   if (!role) {
//     res.status(400);
//     throw new Error("Role is required to generate interview questions.");
//   }

//   let selectedCategories = [];

//   if (Array.isArray(req.body.categories) && req.body.categories.length) {
//     selectedCategories = await InterviewCategory.find({
//       _id: { $in: req.body.categories },
//       isActive: true
//     });
//   }

//   if (!selectedCategories.length) {
//     selectedCategories = await InterviewCategory.find({ isActive: true }).limit(4);
//   }

//   const fallback = buildFallbackResponse(role, difficulty, selectedCategories);
//   const openAIClient = getOpenAIClient();

//   if (!openAIClient) {
//     res.json({
//       role,
//       difficulty,
//       categoriesUsed: selectedCategories.map((item) => item.name),
//       ...fallback
//     });
//     return;
//   }

//   const categoryContext = selectedCategories
//     .map(
//       (category) =>
//         `Category: ${category.name}\nDescription: ${category.description}\nHR focus: ${category.hrPrompt}\nTechnical focus: ${category.technicalFocus}\nAptitude focus: ${category.aptitudeFocus}\nSample roles: ${category.sampleRoles.join(", ")}`
//     )
//     .join("\n\n");

//   try {
//     const response = await openAIClient.responses.create({
//       model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
//       instructions:
//         "You are an interview preparation coach. Return valid JSON only with keys: hrQuestions, technicalQuestions, aptitudeQuestions, tips. Each key must map to an array of concise strings.",
//       input: `Generate an interview prep set for the role "${role}" at "${difficulty}" difficulty.\n\nUse this category guidance when relevant:\n${categoryContext}\n\nRequirements:\n- 4 HR questions\n- 4 technical questions specific to the role\n- 4 aptitude questions\n- 5 preparation tips\n- Make the tone realistic for job seekers\n- Return JSON only`
//     });

//     const parsed = JSON.parse(extractJsonFromText(response.output_text));

//     res.json({
//       role,
//       difficulty,
//       source: "openai",
//       categoriesUsed: selectedCategories.map((item) => item.name),
//       questions: {
//         hr: parsed.hrQuestions || fallback.questions.hr,
//         technical: parsed.technicalQuestions || fallback.questions.technical,
//         aptitude: parsed.aptitudeQuestions || fallback.questions.aptitude
//       },
//       tips: parsed.tips || fallback.tips
//     });
//   } catch (error) {
//     console.error("OpenAI interview generation failed, using fallback:", error.message);

//     res.json({
//       role,
//       difficulty,
//       categoriesUsed: selectedCategories.map((item) => item.name),
//       ...fallback
//     });
//   }
// });

// export {
//   getInterviewCategories,
//   createInterviewCategory,
//   updateInterviewCategory,
//   deleteInterviewCategory,
//   generateInterviewQuestions
// };







import OpenAI from "openai";
import asyncHandler from "../middleware/asyncHandler.js";
import InterviewCategory from "../models/InterviewCategory.js";
import { parseBoolean, parseList } from "./opportunityUtils.js";

let groqClient;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  if (!groqClient) {
    groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }

  return groqClient;
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

const buildChatSystemPrompt = (category) => {
  const base =
    "You are an expert, friendly interview preparation coach for students on a job portal called NextJob. " +
    "Keep answers conversational, encouraging, and concise (use short paragraphs or bullet points, not walls of text). " +
    "Use concrete examples when explaining concepts. If the student asks to be quizzed or mock-interviewed, " +
    "ask exactly one question, wait for their answer, then give specific feedback before asking the next question.";

  if (!category) {
    return `${base} No specific category has been selected, so answer broadly and feel free to ask what role or topic they want to focus on.`;
  }

  return `${base} The student has selected the "${category.name}" category.
Description: ${category.description || "N/A"}
HR focus: ${category.hrPrompt || "General HR/behavioral questions"}
Technical focus: ${category.technicalFocus || "General technical topics"}
Aptitude focus: ${category.aptitudeFocus || "General aptitude/logical reasoning"}
Tailor your answers and any questions you ask to this category.`;
};

// ---------------------------------------------------------------------------
// Category CRUD
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Question generator (form-based, "Generate Prep Set")
// ---------------------------------------------------------------------------

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
  const groq = getGroqClient();

  if (!groq) {
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
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      max_tokens: 1500,
      messages: [
        {
          role: "system",
          content:
            "You are an interview preparation coach. Return valid JSON only with keys: hrQuestions, technicalQuestions, aptitudeQuestions, tips. Each key must map to an array of concise strings. Do not include markdown code fences or any text outside the JSON object."
        },
        {
          role: "user",
          content: `Generate an interview prep set for the role "${role}" at "${difficulty}" difficulty.\n\nUse this category guidance when relevant:\n${categoryContext}\n\nRequirements:\n- 4 HR questions\n- 4 technical questions specific to the role\n- 4 aptitude questions\n- 5 preparation tips\n- Make the tone realistic for job seekers\n- Return JSON only`
        }
      ]
    });

    const rawText = response.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(extractJsonFromText(rawText));

    res.json({
      role,
      difficulty,
      source: "groq",
      categoriesUsed: selectedCategories.map((item) => item.name),
      questions: {
        hr: parsed.hrQuestions || fallback.questions.hr,
        technical: parsed.technicalQuestions || fallback.questions.technical,
        aptitude: parsed.aptitudeQuestions || fallback.questions.aptitude
      },
      tips: parsed.tips || fallback.tips
    });
  } catch (error) {
    console.error("Groq interview generation failed, using fallback:", error.message);

    res.json({
      role,
      difficulty,
      categoriesUsed: selectedCategories.map((item) => item.name),
      ...fallback
    });
  }
});

// ---------------------------------------------------------------------------
// AI Chat Board (free-form + category-guided conversation)
// ---------------------------------------------------------------------------

const chatWithInterviewAI = asyncHandler(async (req, res) => {
  const message = req.body.message?.trim();
  const categoryId = req.body.categoryId;
  const history = Array.isArray(req.body.history) ? req.body.history : [];

  if (!message) {
    res.status(400);
    throw new Error("Message is required.");
  }

  let category = null;
  if (categoryId) {
    category = await InterviewCategory.findById(categoryId);
  }

  const groq = getGroqClient();

  if (!groq) {
    res.json({
      reply:
        "AI chat isn't fully configured yet — please ask the site admin to add a GROQ_API_KEY. In the meantime, try the question generator above!",
      source: "fallback"
    });
    return;
  }

  const trimmedHistory = history
    .filter((item) => item && item.role && item.content)
    .slice(-20)
    .map((item) => ({ role: item.role, content: item.content }));

  const messages = [
    { role: "system", content: buildChatSystemPrompt(category) },
    ...trimmedHistory,
    { role: "user", content: message }
  ];

  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages
    });

    const reply = response.choices?.[0]?.message?.content?.trim();

    res.json({
      reply: reply || "I couldn't generate a response — please try rephrasing your question.",
      source: "groq",
      categoryUsed: category?.name || null
    });
  } catch (error) {
    console.error("Groq chat failed:", error.message);
    res.status(502);
    throw new Error("AI chat is temporarily unavailable. Please try again in a moment.");
  }
});

export {
  getInterviewCategories,
  createInterviewCategory,
  updateInterviewCategory,
  deleteInterviewCategory,
  generateInterviewQuestions,
  chatWithInterviewAI
};