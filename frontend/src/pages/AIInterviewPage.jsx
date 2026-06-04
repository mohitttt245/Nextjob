import { BrainCircuit, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import FeedbackBanner from "../components/FeedbackBanner";
import InputField from "../components/InputField";
import QuestionBlock from "../components/QuestionBlock";
import SectionHeader from "../components/SectionHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  generateInterviewQuestions,
  listInterviewCategories
} from "../services/interviewsService";

const AIInterviewPage = () => {
  useDocumentTitle("AI Interview Preparation");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    role: "",
    difficulty: "intermediate",
    categories: []
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");
        setCategories(await listInterviewCategories());
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load interview categories.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const toggleCategory = (id) => {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(id)
        ? current.categories.filter((item) => item !== id)
        : [...current.categories, id]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const data = await generateInterviewQuestions(form);
      setResult(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Interview questions could not be generated.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrap space-y-8">
      <SectionHeader
        eyebrow="AI Interview Preparation"
        title="Generate role-specific questions for HR, technical, and aptitude rounds"
        description="Choose a target role, set the difficulty level, and optionally guide the generator with admin-managed interview categories."
      />

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="glass-panel-strong p-6 sm:p-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-tide/10 p-3 text-tide dark:bg-tide/20 dark:text-teal-100">
              <BrainCircuit size={22} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Generate Prep Set</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Works with OpenAI when configured and falls back gracefully during setup.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <InputField
              label="Target Role"
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              placeholder="Frontend Developer"
              required
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Difficulty
              </span>
              <select
                value={form.difficulty}
                onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))}
                className="field"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Categories
              </p>
              <div className="grid gap-3">
                {loading ? (
                  <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    Loading categories...
                  </div>
                ) : (
                  categories.map((category) => (
                    <label
                      key={category._id}
                      className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                    >
                      <span className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={form.categories.includes(category._id)}
                          onChange={() => toggleCategory(category._id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-tide focus:ring-tide"
                        />
                        <span>
                          <span className="block font-semibold">{category.name}</span>
                          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                            {category.description}
                          </span>
                        </span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary mt-2" disabled={submitting}>
              <Sparkles size={16} />
              {submitting ? "Generating..." : "Generate Questions"}
            </button>
          </div>
        </form>

        <section className="space-y-4">
          <FeedbackBanner type="error" message={error} />

          {result ? (
            <>
              <div className="glass-panel-strong p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                      {result.role} Interview Pack
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Difficulty: {result.difficulty} • Source: {result.source}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.categoriesUsed?.map((category) => (
                      <span key={category} className="tag-pill">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <QuestionBlock
                  title="HR Questions"
                  questions={result.questions?.hr}
                  accentClass="text-amber-600 dark:text-amber-200"
                />
                <QuestionBlock
                  title="Technical Questions"
                  questions={result.questions?.technical}
                  accentClass="text-tide dark:text-teal-200"
                />
                <QuestionBlock
                  title="Aptitude Questions"
                  questions={result.questions?.aptitude}
                  accentClass="text-sky-600 dark:text-sky-200"
                />

                <div className="glass-panel p-6">
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                    Preparation Tips
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {result.tips?.map((tip) => (
                      <li
                        key={tip}
                        className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                      >
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel flex min-h-[360px] items-center justify-center px-6 text-center">
              <div className="max-w-xl">
                <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                  Your generated prep set will appear here
                </h3>
                <p className="mt-3 text-slate-600 dark:text-slate-300">
                  Start with a role like Frontend Developer, Data Analyst, or Product Manager, then
                  choose the depth of interview practice you want.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AIInterviewPage;
