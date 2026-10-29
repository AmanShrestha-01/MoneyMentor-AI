// DEVELOPMENT FIXTURES — FICTIONAL DATA ONLY.
// This student does not exist. Nothing here comes from a real person, a bank, or
// a research participant. Replace with API data once learner profiles exist (Phase 4).

export type TopicProgress = {
  topic: string;
  lessonsCompleted: number;
  lessonsTotal: number;
};

export type LearningGoal = {
  label: string;
  setBy: "student";
};

export const demoStudent = {
  firstName: "Alex",
  progress: [
    { topic: "Budgeting basics", lessonsCompleted: 3, lessonsTotal: 5 },
    { topic: "Cash flow", lessonsCompleted: 2, lessonsTotal: 4 },
    { topic: "Credit & credit scores", lessonsCompleted: 1, lessonsTotal: 5 },
    { topic: "Student loans", lessonsCompleted: 0, lessonsTotal: 4 },
    { topic: "Saving & emergency funds", lessonsCompleted: 2, lessonsTotal: 3 },
  ] satisfies TopicProgress[],
  goals: [
    { label: "Understand how my student loan interest works", setBy: "student" },
    { label: "Plan for rent without stress each month", setBy: "student" },
  ] satisfies LearningGoal[],
  recommendedLesson: {
    title: "Mapping a month of cash flow",
    minutes: 5,
    reason: "Connects to your goal of planning for rent each month.",
  },
  suggestedQuestions: [
    "I have $500, rent is $350, and I want to buy something for $200. What's left?",
    "What's the difference between subsidized and unsubsidized loans?",
    "What does APR actually mean?",
  ],
};
