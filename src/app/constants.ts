export enum ENGLISH_GENRES {
    All = 'All',
    Literary  = 'Literary',
    Detective_and_Mystery = 'Detective and Mystery',
    Western_Stories = 'Western Stories', 
    Horror_and_Ghost = 'Horror and Ghost',
    Humor = 'Humor, wit and satire',
    Romance = 'Romance', 
    Adventure = 'Adventure'
};

export enum SYSTEM_NAME{
  simfic = 'simfic2',
  bag_of_words = 'bofwords',
  random = 'random'
};

export enum ENGLISH_GENRES_DESCRIPTION {
  Literary = 'A Literary',
  "Detective and Mystery" = 'A Detective and Mystery',
  "Western Stories" = 'A Western Story', 
  "Horror and Ghost" = 'A Horror',
  'Humor, wit and satire' = 'A Humorous',
  Romance = 'A Romantic', 
  Adventure = 'An Adventurous'
}

export enum GERMAN_GENRES {
  All = 'All',
  Literary  = 'Literary',
  Romance = 'Romance', 
  Juvenile = 'Juvenile fiction',
  Travel = 'Travel',
  Fantasy = 'Fantasy',
  History = 'History'
};

export enum LANGUAGES {
  English = 'en',
  German = 'de'
};

export enum DEFAULT_LANGUAGE_SETTINGS {
  ENGLISH_GENRE = ENGLISH_GENRES.All,
  GERMAN_GENRE = GERMAN_GENRES.All,
  LANGUAGE = LANGUAGES.English
}

export const ENGLISH_GENRES_LIST = [
  ENGLISH_GENRES.All, 
  ENGLISH_GENRES.Literary, 
  ENGLISH_GENRES.Detective_and_Mystery,
  ENGLISH_GENRES.Western_Stories, 
  ENGLISH_GENRES.Horror_and_Ghost, 
  ENGLISH_GENRES.Humor,
  ENGLISH_GENRES.Romance,
  ENGLISH_GENRES.Adventure
]


export const GERMAN_GENRES_LIST = [
  GERMAN_GENRES.All,
  GERMAN_GENRES.Literary,
  GERMAN_GENRES.Romance,
  GERMAN_GENRES.Juvenile,
  GERMAN_GENRES.Travel,
  GERMAN_GENRES.Fantasy,
  GERMAN_GENRES.History
];

export const TOP_K = 25;

export const GOOGLE_API_KEY = "<<Insert Google API KEY here>>";

export const GOOGLE_SHEETS = [
  "<<Insert link to Sheet ABC>>", //ABC
  "<<Insert link to Sheet BAC>>", //BAC
  "<<Insert link to Sheet CBA>>"  //CBA
]

export const GOOGLE_FORMS = [
  "<<Insert link to Form ABC>>",, //ABC
  "<<Insert link to Form BAC>>",, //BAC
  "<<Insert link to Form CBA>>",, //CBA
]

FEATURE_TYPES = {
  setValue: function( props, value ) {
      while ( props.length ) this[ props.pop() ] = value;
  }
}

FEATURE_TYPES.setValue(['0', '3', '4', '5', '9', '10', '11', '12'],  ['Writing Style'] )
FEATURE_TYPES.setValue(['6', '7', '8'],  ['Sentence Complexity'] )
FEATURE_TYPES.setValue(['1'],  ['Female Oriented', 'Writing Style'] )
FEATURE_TYPES.setValue(['2'],  ['Male Oriented', 'Writing Style'] )
FEATURE_TYPES.setValue(['13', '14'],  ['Sentence Complexity', 'Writing Style'] )
FEATURE_TYPES.setValue(['15'],  ['Rural or Urban Setting'] )
FEATURE_TYPES.setValue(['16', '17', '18'],  ['Sentiment'])
FEATURE_TYPES.setValue(['19'], ['Ease of readability'])
FEATURE_TYPES.setValue(['20'],  ['Rural or Urban Setting', 'Plot Complexity'])
FEATURE_TYPES.setValue(['21'],  ['Lexical Richness'])
FEATURE_TYPES.setValue(['22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],  ['Theme'])
FEATURE_TYPES.setValue(['32'],  ['Conversation ratio'])
FEATURE_TYPES.setValue(['33'],  ['Number of Speakers'])
FEATURE_TYPES.setValue(['34'],  ['Presence of a Protagonist'])
FEATURE_TYPES.setValue(['35', '36', '37', '38', '39', '40'],  ['Plot Development'])


export var FEATURE_TYPES;

export var FEATURE_DESCRIPTION = {
  "Writing Style" : "Readers prefer certain similar kinds of the writing style of authors. Writing styles are defined based on the usage of different parts of speech and punctuations",

  "Female Oriented" : "This key factor depicts that the books have a story revolving more around the female characters",

  "Male Oriented" : "This key factor depicts that the books have a story revolving more around the male characters",

  "Sentence Complexity" : "This factor depicts the  complexity of sentence on the basis of length of the sentences and punctuations",

  "Plot Complexity" : "This factor depicts the number of characters in the story",

  "Rural or Urban Setting" : "This factor describes the subject of the story. It is influenced by the amount of conversation and number of people in the story",

  "Sentiment" : "This factor describes the overall sentiment of the book i.e. either Positive or Negative or Neutral",

  "Ease of readability" : "This factor is the reading easability of the books. Books with the similar ease of readability are retrieved below",

  "Lexical Richness" : "This factor defines the degree of usage of distinct words in the book",

  "Theme" : "This factor retrieves books based on the Genre of the book",

  "Conversation ratio" : "This factor describes the degree of the number of conversations in the book",

  "Number of Speakers" : "This factor defines the number of speakers in the book",

  "Presence of a Protagonist" : "This factor sorts books based on the presence of a main character",

  "Plot Development" : "This factor sorts books based on the plot development from the start to end"
}
