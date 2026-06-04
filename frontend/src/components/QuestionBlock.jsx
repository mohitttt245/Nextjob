const QuestionBlock = ({ title, questions, accentClass }) => (
  <div className="glass-panel p-6">
    <h3 className={`text-xl font-semibold ${accentClass}`}>{title}</h3>
    <ul className="mt-4 space-y-3">
      {questions?.map((question) => (
        <li
          key={question}
          className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
        >
          {question}
        </li>
      ))}
    </ul>
  </div>
);

export default QuestionBlock;
