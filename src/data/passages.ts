export interface Passage {
  id: string;
  title: string;
  level: "Easy" | "Medium" | "Challenging";
  estimatedMinutes: string;
  text: string;
  words: number;
}

const countWords = (text: string) => text.trim().split(/\s+/).length;

const makePassage = (
  id: string,
  title: string,
  level: Passage["level"],
  estimatedMinutes: string,
  text: string,
): Passage => ({
  id,
  title,
  level,
  estimatedMinutes,
  text: text.trim(),
  words: countWords(text),
});

export const passages: Passage[] = [
  makePassage(
    "morning-walk",
    "A Morning Walk",
    "Easy",
    "1 min",
    `The morning air is cool and quiet. I step outside and follow the path beside the river. Birds call from the trees, and the water moves slowly over the stones. I breathe in deeply and let my shoulders relax. There is no rush. For a few minutes, I simply walk, listen, and enjoy the gentle start of a new day.`,
  ),
  makePassage(
    "little-library",
    "The Little Library",
    "Medium",
    "2 min",
    `At the end of our street there is a small wooden library, no bigger than a cupboard. Neighbours leave books inside and take others home. Nobody keeps a record, and nobody asks for a fee. On a rainy afternoon I found a collection of short stories there, with a note tucked between the pages. It said that a good story should travel further than the person who first told it. I read the book in two evenings and returned it the next week, adding a note of my own for whoever might find it next.`,
  ),
  makePassage(
    "speaking-confidence",
    "Speaking with Confidence",
    "Challenging",
    "3 min",
    `Speaking clearly is less about being perfect and more about being understood. When we slow down, breathe from the diaphragm, and give ourselves permission to pause, our words become easier to follow. A pause is not a failure. It is a natural part of speech, and it gives both the speaker and the listener a moment to think. Practice in a comfortable room, with a passage you have chosen, and notice how your voice changes when you are not rushing. Over time, these small moments of awareness can turn into steady, confident communication.`,
  ),
];

export const defaultPassage = passages[0];
