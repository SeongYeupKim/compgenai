/** 5-point agreement scale used for AIALI and Trust in GenAI. */
export const LIKERT_SCALE = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
] as const;

/** AIALI items, fixed order. */
export const AIALI_ITEMS: readonly string[] = [
  "GenAI enhances my ability to organize and synthesize information from different sources.",
  "GenAI assists me in understanding difficult concepts more easily.",
  "GenAI is useful for checking my understanding of course materials.",
  "GenAI improves the quality of my learning outcomes.",
  "GenAI provides useful feedback that supports my academic progress.",
  "GenAI helps me summarize ideas and structure course concepts more effectively.",
  "GenAI is useful for brainstorming and developing new ideas.",
  "GenAI is useful for generating or refining my academic work (e.g., essays).",
  "Using GenAI tools in my learning helps me complete tasks more efficiently.",
  "I can critically interact with GenAI tools considering they can generate misinformation.",
  "I can effectively use GenAI for learning without assistance from others.",
  "I can recognize how the GenAI arrives at its suggestions or explanations.",
  "GenAI tools require little effort to integrate into my learning process.",
  "I know how to re-question and re-ask GenAI if their responses do not align with my purpose.",
  "I feel confident using GenAI to support my studies.",
] as const;

/** Trust in AI (Choung, David, & Ross, 2023), wording adapted to GenAI. Fixed order. */
export const TRUST_ITEMS: readonly string[] = [
  "GenAI cares about our well-being.",
  "GenAI is sincerely concerned about addressing the problems of human users.",
  "GenAI tries to be helpful and does not operate out of selfish interest.",
  "GenAI is truthful in its dealings.",
  "GenAI keeps its commitments and delivers on its promises.",
  "GenAI is honest and does not abuse the information and advantage it has over its users.",
  "GenAI works well.",
  "GenAI has the features necessary to complete key tasks.",
  "GenAI is reliable.",
  "GenAI is dependable.",
] as const;

export type McItem = {
  id: string;
  stem: string;
  options: readonly [string, string, string, string];
};

export const MC_LETTERS = ["A", "B", "C", "D"] as const;

/**
 * Prior- and post-knowledge multiple choice.
 * Option order matches the source document. Answer positions are not shuffled.
 */
export const KNOWLEDGE_MC_ITEMS: readonly McItem[] = [
  {
    id: "mc1",
    stem: "Which statement best describes self-efficacy?",
    options: [
      "A person's overall sense of worth as an individual",
      "A person's belief about their capability to carry out actions required for a particular task",
      "The degree to which a task is enjoyable",
      "A person's actual level of academic achievement",
    ],
  },
  {
    id: "mc2",
    stem: "Which statement most accurately describes the relationship between self-efficacy and actual ability?",
    options: [
      "Students with equal ability necessarily have equal self-efficacy.",
      "Self-efficacy is determined exclusively by previous grades.",
      "Students with similar abilities can differ in perceived capability, which may influence their engagement.",
      "High self-efficacy guarantees successful performance.",
    ],
  },
  {
    id: "mc3",
    stem: "A student attributes a poor performance to a cause that is stable and largely uncontrollable. What is the most likely implication for future achievement expectations?",
    options: [
      "The student will necessarily increase effort.",
      "The student may expect similar difficulties in the future.",
      "The student will no longer value the task.",
      "The student will automatically adopt mastery goals.",
    ],
  },
  {
    id: "mc4",
    stem: "What distinguishes a mastery-approach goal from a performance-approach goal?",
    options: [
      "Mastery-approach goals focus on improving competence, whereas performance-approach goals focus on demonstrating competence relative to others.",
      "Mastery-approach goals require intrinsic motivation, whereas performance-approach goals require rewards.",
      "Mastery-approach goals involve little effort, whereas performance-approach goals involve substantial effort.",
      "Mastery-approach goals concern grades, whereas performance-approach goals concern understanding.",
    ],
  },
  {
    id: "mc5",
    stem: "In expectancy-value perspectives, what does perceived task cost represent?",
    options: [
      "The objective financial cost of instruction",
      "The amount of prior knowledge required to understand a task",
      "The negative aspects of engaging in a task, such as anticipated effort, lost opportunities, or emotional consequences",
      "The teacher's judgment of how difficult a task is",
    ],
  },
  {
    id: "mc6",
    stem: "Which conclusion best follows from distinguishing students' motivational beliefs from their observable engagement?",
    options: [
      "Engagement always reveals which motivational belief a student holds.",
      "Motivational beliefs are irrelevant when a student completes an assignment.",
      "Identical levels of engagement can reflect different motivational reasons.",
      "Students who perform well cannot experience motivational difficulties.",
    ],
  },
  {
    id: "mc7",
    stem: "Which statement most accurately distinguishes metacognitive knowledge from metacognitive regulation?",
    options: [
      "Metacognitive knowledge concerns awareness of cognition and strategies, whereas regulation concerns planning, monitoring, and adjusting cognitive activity.",
      "Metacognitive knowledge refers only to memory, whereas regulation refers only to motivation.",
      "Metacognitive knowledge is acquired after learning, whereas regulation occurs only before learning.",
      "Metacognitive knowledge is always accurate, whereas regulation is always conscious.",
    ],
  },
  {
    id: "mc8",
    stem: "A learner judges that a current study strategy is ineffective but continues using it without modification. Which interpretation is most appropriate?",
    options: [
      "The learner necessarily lacks all relevant metacognitive knowledge.",
      "The learner demonstrates monitoring, but effective control or strategy adjustment is not evident.",
      "The learner has successfully completed the entire self-regulation process.",
      "The learner's difficulty must be caused by limited working-memory capacity.",
    ],
  },
  {
    id: "mc9",
    stem: "Which sequence best represents a general cycle of self-regulated learning?",
    options: [
      "Evaluation, then memorization, then external reward",
      "Planning and goal setting, then monitoring and strategy use, then evaluation and adaptation",
      "Strategy selection, then automatic success, then reduced effort",
      "Information retrieval, then performance comparison, then task avoidance",
    ],
  },
  {
    id: "mc10",
    stem: "Why is strategic flexibility important in self-regulated learning?",
    options: [
      "One strategy is equally effective for all goals and contexts.",
      "Strategy effectiveness depends partly on task demands, learning goals, and evidence of progress.",
      "Changing strategies always reduces cognitive effort.",
      "Flexible learners avoid evaluating their strategies.",
    ],
  },
  {
    id: "mc11",
    stem: "What is the principal function of metacognitive monitoring during learning?",
    options: [
      "To ensure information is stored permanently in memory",
      "To judge current understanding, progress, or the effectiveness of learning activities",
      "To eliminate the need for external feedback",
      "To increase the number of strategies a learner knows",
    ],
  },
  {
    id: "mc12",
    stem: "Which explanation best represents the interaction between motivation and self-regulated learning?",
    options: [
      "Motivation affects whether learners engage in regulation, while regulatory experiences can also influence motivational beliefs.",
      "Motivation and self-regulated learning are unrelated processes.",
      "Self-regulation becomes unnecessary when learners are highly motivated.",
      "Motivational beliefs influence performance only after learning is complete.",
    ],
  },
  {
    id: "mc13",
    stem: "Why can working memory constrain learning from complex information?",
    options: [
      "Working memory permanently stores all previously learned information.",
      "Working memory has limited capacity for simultaneously maintaining and processing information.",
      "Working memory is unaffected by information organization.",
      "Working memory operates independently of attention.",
    ],
  },
  {
    id: "mc14",
    stem: "What role does prior knowledge generally play in meaningful learning?",
    options: [
      "It completely determines how accurately new information will be understood.",
      "It provides existing knowledge structures that can support interpretation and integration of new information.",
      "It makes all new learning automatic.",
      "It prevents learners from revising misconceptions.",
    ],
  },
  {
    id: "mc15",
    stem: "Which description best distinguishes meaningful learning from rote memorization?",
    options: [
      "Meaningful learning involves relating new information to existing knowledge, whereas rote learning may preserve information without well-developed conceptual connections.",
      "Meaningful learning involves no memory processes.",
      "Rote memorization always produces superior transfer.",
      "Meaningful learning requires that all concepts be discovered independently.",
    ],
  },
  {
    id: "mc16",
    stem: "Why does the organization of knowledge influence comprehension and problem solving?",
    options: [
      "Knowledge organization determines intelligence.",
      "Connections among concepts may support retrieval, inference generation, and application.",
      "Well-organized knowledge eliminates the need for strategies.",
      "Knowledge organization matters only when recalling definitions.",
    ],
  },
  {
    id: "mc17",
    stem: "Which condition best supports transfer of learning to a new situation?",
    options: [
      "Remembering only the surface details of an original example",
      "Avoiding any comparison between learning contexts",
      "Understanding underlying principles and recognizing their relevance to new task demands",
      "Using a familiar strategy regardless of the new task's characteristics",
    ],
  },
] as const;

export type CrItem = { id: string; prompt: string };

export const KNOWLEDGE_CR_ITEMS: readonly CrItem[] = [
  {
    id: "cr1",
    prompt:
      "According to attribution theory, what is the difference between a stable and an unstable attribution? Explain how this distinction may influence expectations for future performance.",
  },
  {
    id: "cr2",
    prompt:
      "What is the difference between metacognitive monitoring and metacognitive control? Briefly explain how the two processes are related.",
  },
  {
    id: "cr3",
    prompt:
      "What role does prior knowledge play in meaningful learning? Explain one way in which prior knowledge can facilitate or interfere with understanding new information.",
  },
] as const;
