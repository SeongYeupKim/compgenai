export const ESSAY_WORD_LIMIT = 550;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export type ReadingSource = {
  id: string;
  title: string;
  filename: string;
  href: string;
};

export const READINGS: readonly ReadingSource[] = [
  {
    id: "motivation",
    title: "Motivation",
    filename: "EDPSY_Reading_01_Motivation_2026.pdf",
    href: "/readings/EDPSY_Reading_01_Motivation_2026.pdf",
  },
  {
    id: "metacognition",
    title: "Metacognition",
    filename: "EDPSY_Reading_02_Metacognition_2026.pdf",
    href: "/readings/EDPSY_Reading_02_Metacognition_2026.pdf",
  },
  {
    id: "cognitive_learning",
    title: "Cognitive learning",
    filename: "EDPSY_Reading_03_Cognitive_Learning_2026.pdf",
    href: "/readings/EDPSY_Reading_03_Cognitive_Learning_2026.pdf",
  },
] as const;

export const CASE_TITLE = "Why Is Daniel Struggling in Science Class?";

export const CASE_PARAGRAPHS: readonly string[] = [
  "Daniel is a ninth-grade student in Ms. Carter's science class. Earlier in the semester, Daniel regularly completed assignments, participated in class discussions, and performed reasonably well on quizzes that assessed his understanding of scientific concepts. However, over the past several weeks, Ms. Carter has noticed changes in his academic engagement and performance, particularly when assignments require him to apply what he has learned to unfamiliar problems.",
  "Recently, the class began a project in which students investigate an environmental issue, examine information, and develop an evidence-based recommendation. Although Daniel initially expressed interest in the topic, he has struggled to make progress. He often spends considerable time reading the provided materials but has difficulty deciding which information is important or how different pieces of evidence relate to one another. When two sources present different explanations, Daniel tends to select the one that seems easiest to understand rather than examining the reasons for their disagreement. He frequently begins writing his response before organizing the evidence and later finds that his ideas do not fit together.",
  'During one class, Daniel told Ms. Carter, "I understand the readings when I go through them, but when I have to explain everything in my own words, I get confused. Other students seem to know how to do this, but I don\'t." Since then, he has become less willing to share his ideas in class. When asked to explain his reasoning, he often gives brief answers or says he is unsure, even when he has correctly identified relevant information.',
  "Ms. Carter has also noticed that Daniel approaches challenging tasks differently from easier assignments. When he encounters difficulties, he frequently rereads the same passages or searches for additional information without evaluating whether these strategies are helping. He rarely revises his initial approach or asks for clarification. If he cannot make progress quickly, he sometimes leaves parts of the assignment incomplete. After receiving a disappointing grade on a recent project, Daniel commented, \"Maybe I'm just not good at assignments like this. I study, but it doesn't seem to make much difference.\"",
  "To encourage him, Ms. Carter has begun offering extra credit for completing intermediate assignments and praising him when he submits his work on time. Daniel now turns in assignments more consistently, but his written explanations remain superficial, and he continues to avoid tasks that require integrating information or defending a conclusion. Ms. Carter is concerned that Daniel's difficulties may extend beyond his effort or willingness to participate, but she is uncertain how to help him develop more effective approaches to learning.",
];

export const TASK_INTRO =
  "Imagine that you are an educational consultant asked to help Ms. Carter understand and address Daniel's learning difficulties. Drawing on the classroom case and the three assigned educational psychology texts (you don't have to cite all three sources), write an essay (no longer than 550 words) addressing the following:";

export const TASK_PROMPTS: readonly { title: string; detail: string }[] = [
  {
    title: "Diagnose the problems.",
    detail:
      "Identify at least three distinct learning or motivational problems Daniel is experiencing. For each problem, explain what evidence from the classroom case supports your identification.",
  },
  {
    title: "Interpret the problems.",
    detail:
      "Apply relevant educational psychology theories or concepts from the assigned texts to explain why Daniel may be experiencing these difficulties. Your explanations should connect their psychological mechanisms to specific case evidence.",
  },
  {
    title: "Recommend solutions.",
    detail:
      "Propose instructional strategies Ms. Carter could use to address the identified problems. Explain how each strategy follows from your theoretical interpretation and why it may support Daniel's learning.",
  },
];

export const TASK_GENAI_NOTE =
  "You may use a GenAI chatbot to assist with your work, but your final recommendations must be justified using the classroom evidence and relevant educational psychology concepts. Cite the source you used when you referred to it (e.g., (Ormrod & Jones, 2023; Chatbot)).";

export const TASK_DO_NOT_PASTE =
  "Do not simply copy and paste the assignment to generative AI.";
