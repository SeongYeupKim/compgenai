/**
 * Informed consent for the multiple-source GenAI study.
 * Update this text if the IRB-approved wording changes.
 */
export const INFORMED_CONSENT_TITLE =
  "Learning from multiple sources with generative AI";

export const INFORMED_CONSENT_SECTIONS: {
  heading: string;
  paragraphs: string[];
}[] = [
  {
    heading: "1. Purpose of the Study",
    paragraphs: [
      "The purpose of this research is to examine how undergraduate students learn from and integrate multiple complementary educational psychology texts when a generative AI chatbot is also available.",
    ],
  },
  {
    heading: "2. Procedures to be followed",
    paragraphs: [
      "You will sign in, answer questionnaires about generative AI, and complete a short knowledge check. You will then read a classroom case, download three assigned readings, and write an essay of no more than 550 words. A chatbot is available beside the essay. After the essay you will complete the knowledge check again, a short demographics form, and download a personal record of your essay and chat history to upload to Canvas.",
      "Proceeding with the study after reading this information indicates that you are consenting to participate in this research.",
    ],
  },
  {
    heading: "3. Discomforts and Risks",
    paragraphs: [
      "There are no known risks associated with the study procedures beyond those ordinarily encountered in daily life. Some participants may experience mild discomfort associated with completing writing tasks, reading instructional text, or answering survey questions.",
    ],
  },
  {
    heading: "4. Benefits",
    paragraphs: [
      "Participation may give you practice integrating ideas from more than one text and using a chatbot as part of that work. There is no guarantee that you will benefit personally from participation.",
    ],
  },
  {
    heading: "5. Statement of Confidentiality",
    paragraphs: [
      "Your participation is confidential. Responses are stored electronically in a secure, access-controlled research database used only for this project. Your account is used to link sessions; only the research team can access data tied to your account as needed to conduct the study.",
      "The assignment record you download contains your essay and chat history so you can submit it as proof of completion. That file is yours to upload where your instructor directs.",
      "Data will be retained according to institutional policy and will be destroyed or appropriately de-identified after the study ends, in line with those requirements. Your confidentiality will be protected to the extent permitted by the technology used. No data transmission over the Internet can be guaranteed completely secure from interception by third parties.",
      "If the results of this research are published or presented, no personally identifiable information will be disclosed.",
    ],
  },
  {
    heading: "6. Right to Ask Questions",
    paragraphs: [
      "Please contact Seong Kim (smk7568@psu.edu) with questions, complaints, or concerns about this research.",
    ],
  },
  {
    heading: "7. Voluntary Participation",
    paragraphs: [
      "Your decision to participate is voluntary. You may stop at any time. You do not have to answer any question you do not want to answer. Refusal to participate or withdrawal from the study will involve no penalty or loss of benefits to which you are otherwise entitled.",
    ],
  },
];

export const INFORMED_CONSENT_AGE_NOTICE =
  "You must be 18 years of age or older to take part in this research study.";

export const INFORMED_CONSENT_CLOSING =
  "Completion and submission of the study activities implies that you have read this information and consent to participate. You may wish to print or save a copy of this page for your records.";
