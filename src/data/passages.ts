export interface Passage {
  id: string;
  title: string;
  level: "Easy" | "Medium" | "Challenging";
  estimatedMinutes: string;
  text: string;
  words: number;
  language: "english" | "nepali" | "hindi";
}

export interface Language {
  id: "english" | "nepali" | "hindi";
  label: string;
  nativeLabel: string;
}

export const languages: Language[] = [
  { id: "english", label: "English", nativeLabel: "English" },
  { id: "hindi", label: "Hindi", nativeLabel: "हिन्दी" },
  { id: "nepali", label: "Nepali", nativeLabel: "नेपाली" },
];

const countWords = (text: string) => text.trim().split(/\s+/).length;

const makePassage = (
  id: string,
  title: string,
  level: Passage["level"],
  estimatedMinutes: string,
  text: string,
  language: Passage["language"],
): Passage => ({
  id,
  title,
  level,
  estimatedMinutes,
  text: text.trim(),
  words: countWords(text),
  language,
});

export const passages: Passage[] = [
  // English
  makePassage(
    "morning-walk",
    "A Morning Walk",
    "Easy",
    "1 min",
    `The morning air is cool and quiet. I step outside and follow the path beside the river. Birds call from the trees, and the water moves slowly over the stones. I breathe in deeply and let my shoulders relax. There is no rush. For a few minutes, I simply walk, listen, and enjoy the gentle start of a new day.`,
    "english",
  ),
  makePassage(
    "little-library",
    "The Little Library",
    "Medium",
    "2 min",
    `At the end of our street there is a small wooden library, no bigger than a cupboard. Neighbours leave books inside and take others home. Nobody keeps a record, and nobody asks for a fee. On a rainy afternoon I found a collection of short stories there, with a note tucked between the pages.`,
    "english",
  ),
  makePassage(
    "speaking-confidence",
    "Speaking with Confidence",
    "Challenging",
    "3 min",
    `Speaking clearly is less about being perfect and more about being understood. When we slow down, breathe from the diaphragm, and give ourselves permission to pause, our words become easier to follow. A pause is not a failure. It is a natural part of speech, and it gives both the speaker and the listener a moment to think.`,
    "english",
  ),
  // Hindi
  makePassage(
    "hindi-subah",
    "सुबह की सैर",
    "Easy",
    "1 min",
    `सुबह की हवा ठंडी और शांत है। मैं बाहर कदम रखता हूँ और नदी के किनारे रास्ते पर चलता हूँ। पेड़ों पर पक्षी चहचहाते हैं, और पानी धीरे-धीरे पत्थरों पर बहता है। मैं गहरी सांस लेता हूँ और अपने कंधों को आराम देता हूँ। कोई जल्दी नहीं है। कुछ मिनटों के लिए, मैं बस चलता हूँ, सुनता हूँ, और एक नए दिन की शुरुआत का आनंद लेता हूँ।`,
    "hindi",
  ),
  makePassage(
    "hindi-pustakalaya",
    "छोटी पुस्तकालय",
    "Medium",
    "2 min",
    `हमारी सड़क के अंत में एक छोटी लकड़ी की पुस्तकालय है, जो एक आलमारी से बड़ी नहीं है। पड़ोसी अंदर किताबें छोड़ते हैं और दूसरों को घर ले जाते हैं। कोई रिकॉर्ड नहीं रखता, और कोई शुल्क नहीं मांगता। एक बरसाती दोपहर को मैंने वहाँ छोटी कहानियों का एक संग्रह पाया, पन्नों के बीच एक नोट दबा हुआ था।`,
    "hindi",
  ),
  // Nepali
  makePassage(
    "nepali-bihani",
    "बिहानी हल्का",
    "Easy",
    "1 min",
    `बिहानको हावा चिसो र शान्त छ। म बाहिर निस्किएको छु र नदीको किनारको बाटोमा हिड्छु। रुखमा चराहरू बोल्छन्, र पानी ढिलो ढिलो ढुङ्गाको माथिबाट बग्छ। म गहिरो साँस फेर्छु र आफ्नो काँधलाई आराम दिन्छु। कुनै जल्दी छैन। केही मिनेटको लागि, म सीधै हिड्छु, सुन्छु, र नयाँ दिनको नरम सुरुवातको आनन्द लिन्छु।`,
    "nepali",
  ),
  makePassage(
    "nepali-pustakalaya",
    "सानो पुस्तकालय",
    "Medium",
    "2 min",
    `हाम्रो सडकको अन्त्यमा एउटा सानो काठको पुस्तकालय छ, जसको आकार अलमारीभन्दा बढी छैन। हामीजना गृहस्वामी भित्रमुनि किताब छोड्छन् र अरुलाई घर लैजान्छन्। कोही रेकर्ड राख्दैनन्, र कोही शुल्क माग्दैनन्। एक जलाधार दोपहरमा मसँग त्यहाँ छोटा कथाहरूको संग्रह भेट्यो, पानाका बीचमा एक नोट ठन्डो गरिएको छ।`,
    "nepali",
  ),
];

export const defaultLanguage = "english";
export const getDefaultPassage = (language: string) =>
  passages.find((p) => p.language === language) ?? passages[0];
