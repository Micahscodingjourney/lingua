export type Kana = { char: string; romaji: string };
export type KanaRow = { label: string; kana: Kana[] };

export const HIRAGANA_MAIN: KanaRow[] = [
  { label: "あ行", kana: [{ char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" }, { char: "え", romaji: "e" }, { char: "お", romaji: "o" }] },
  { label: "か行", kana: [{ char: "か", romaji: "ka" }, { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" }, { char: "こ", romaji: "ko" }] },
  { label: "さ行", kana: [{ char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" }, { char: "す", romaji: "su" }, { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" }] },
  { label: "た行", kana: [{ char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" }, { char: "て", romaji: "te" }, { char: "と", romaji: "to" }] },
  { label: "な行", kana: [{ char: "な", romaji: "na" }, { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" }, { char: "の", romaji: "no" }] },
  { label: "は行", kana: [{ char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" }, { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" }] },
  { label: "ま行", kana: [{ char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" }, { char: "め", romaji: "me" }, { char: "も", romaji: "mo" }] },
  { label: "や行", kana: [{ char: "や", romaji: "ya" }, { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" }] },
  { label: "ら行", kana: [{ char: "ら", romaji: "ra" }, { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" }, { char: "ろ", romaji: "ro" }] },
  { label: "わ行", kana: [{ char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" }, { char: "ん", romaji: "n" }] },
];

export const HIRAGANA_DAKUTEN: KanaRow[] = [
  { label: "が行", kana: [{ char: "が", romaji: "ga" }, { char: "ぎ", romaji: "gi" }, { char: "ぐ", romaji: "gu" }, { char: "げ", romaji: "ge" }, { char: "ご", romaji: "go" }] },
  { label: "ざ行", kana: [{ char: "ざ", romaji: "za" }, { char: "じ", romaji: "ji" }, { char: "ず", romaji: "zu" }, { char: "ぜ", romaji: "ze" }, { char: "ぞ", romaji: "zo" }] },
  { label: "だ行", kana: [{ char: "だ", romaji: "da" }, { char: "ぢ", romaji: "di" }, { char: "づ", romaji: "du" }, { char: "で", romaji: "de" }, { char: "ど", romaji: "do" }] },
  { label: "ば行", kana: [{ char: "ば", romaji: "ba" }, { char: "び", romaji: "bi" }, { char: "ぶ", romaji: "bu" }, { char: "べ", romaji: "be" }, { char: "ぼ", romaji: "bo" }] },
  { label: "ぱ行", kana: [{ char: "ぱ", romaji: "pa" }, { char: "ぴ", romaji: "pi" }, { char: "ぷ", romaji: "pu" }, { char: "ぺ", romaji: "pe" }, { char: "ぽ", romaji: "po" }] },
];

export const HIRAGANA_COMBO: KanaRow[] = [
  { label: "きゃ", kana: [{ char: "きゃ", romaji: "kya" }, { char: "きゅ", romaji: "kyu" }, { char: "きょ", romaji: "kyo" }] },
  { label: "しゃ", kana: [{ char: "しゃ", romaji: "sha" }, { char: "しゅ", romaji: "shu" }, { char: "しょ", romaji: "sho" }] },
  { label: "ちゃ", kana: [{ char: "ちゃ", romaji: "cha" }, { char: "ちゅ", romaji: "chu" }, { char: "ちょ", romaji: "cho" }] },
  { label: "にゃ", kana: [{ char: "にゃ", romaji: "nya" }, { char: "にゅ", romaji: "nyu" }, { char: "にょ", romaji: "nyo" }] },
  { label: "ひゃ", kana: [{ char: "ひゃ", romaji: "hya" }, { char: "ひゅ", romaji: "hyu" }, { char: "ひょ", romaji: "hyo" }] },
  { label: "みゃ", kana: [{ char: "みゃ", romaji: "mya" }, { char: "みゅ", romaji: "myu" }, { char: "みょ", romaji: "myo" }] },
  { label: "りゃ", kana: [{ char: "りゃ", romaji: "rya" }, { char: "りゅ", romaji: "ryu" }, { char: "りょ", romaji: "ryo" }] },
  { label: "ぎゃ", kana: [{ char: "ぎゃ", romaji: "gya" }, { char: "ぎゅ", romaji: "gyu" }, { char: "ぎょ", romaji: "gyo" }] },
  { label: "じゃ", kana: [{ char: "じゃ", romaji: "ja" }, { char: "じゅ", romaji: "ju" }, { char: "じょ", romaji: "jo" }] },
  { label: "びゃ", kana: [{ char: "びゃ", romaji: "bya" }, { char: "びゅ", romaji: "byu" }, { char: "びょ", romaji: "byo" }] },
  { label: "ぴゃ", kana: [{ char: "ぴゃ", romaji: "pya" }, { char: "ぴゅ", romaji: "pyu" }, { char: "ぴょ", romaji: "pyo" }] },
];

// Katakana mirrors hiragana structure
export const KATAKANA_MAIN: KanaRow[] = [
  { label: "ア行", kana: [{ char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" }, { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" }] },
  { label: "カ行", kana: [{ char: "カ", romaji: "ka" }, { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" }, { char: "コ", romaji: "ko" }] },
  { label: "サ行", kana: [{ char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" }, { char: "ス", romaji: "su" }, { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" }] },
  { label: "タ行", kana: [{ char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" }, { char: "テ", romaji: "te" }, { char: "ト", romaji: "to" }] },
  { label: "ナ行", kana: [{ char: "ナ", romaji: "na" }, { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" }, { char: "ネ", romaji: "ne" }, { char: "ノ", romaji: "no" }] },
  { label: "ハ行", kana: [{ char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" }, { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" }, { char: "ホ", romaji: "ho" }] },
  { label: "マ行", kana: [{ char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" }, { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" }] },
  { label: "ヤ行", kana: [{ char: "ヤ", romaji: "ya" }, { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" }] },
  { label: "ラ行", kana: [{ char: "ラ", romaji: "ra" }, { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" }, { char: "レ", romaji: "re" }, { char: "ロ", romaji: "ro" }] },
  { label: "ワ行", kana: [{ char: "ワ", romaji: "wa" }, { char: "ヲ", romaji: "wo" }, { char: "ン", romaji: "n" }] },
];

export const KATAKANA_DAKUTEN: KanaRow[] = [
  { label: "ガ行", kana: [{ char: "ガ", romaji: "ga" }, { char: "ギ", romaji: "gi" }, { char: "グ", romaji: "gu" }, { char: "ゲ", romaji: "ge" }, { char: "ゴ", romaji: "go" }] },
  { label: "ザ行", kana: [{ char: "ザ", romaji: "za" }, { char: "ジ", romaji: "ji" }, { char: "ズ", romaji: "zu" }, { char: "ゼ", romaji: "ze" }, { char: "ゾ", romaji: "zo" }] },
  { label: "ダ行", kana: [{ char: "ダ", romaji: "da" }, { char: "ヂ", romaji: "di" }, { char: "ヅ", romaji: "du" }, { char: "デ", romaji: "de" }, { char: "ド", romaji: "do" }] },
  { label: "バ行", kana: [{ char: "バ", romaji: "ba" }, { char: "ビ", romaji: "bi" }, { char: "ブ", romaji: "bu" }, { char: "ベ", romaji: "be" }, { char: "ボ", romaji: "bo" }] },
  { label: "パ行", kana: [{ char: "パ", romaji: "pa" }, { char: "ピ", romaji: "pi" }, { char: "プ", romaji: "pu" }, { char: "ペ", romaji: "pe" }, { char: "ポ", romaji: "po" }] },
];

export const KATAKANA_COMBO: KanaRow[] = [
  { label: "キャ", kana: [{ char: "キャ", romaji: "kya" }, { char: "キュ", romaji: "kyu" }, { char: "キョ", romaji: "kyo" }] },
  { label: "シャ", kana: [{ char: "シャ", romaji: "sha" }, { char: "シュ", romaji: "shu" }, { char: "ショ", romaji: "sho" }] },
  { label: "チャ", kana: [{ char: "チャ", romaji: "cha" }, { char: "チュ", romaji: "chu" }, { char: "チョ", romaji: "cho" }] },
  { label: "ニャ", kana: [{ char: "ニャ", romaji: "nya" }, { char: "ニュ", romaji: "nyu" }, { char: "ニョ", romaji: "nyo" }] },
  { label: "ヒャ", kana: [{ char: "ヒャ", romaji: "hya" }, { char: "ヒュ", romaji: "hyu" }, { char: "ヒョ", romaji: "hyo" }] },
  { label: "ミャ", kana: [{ char: "ミャ", romaji: "mya" }, { char: "ミュ", romaji: "myu" }, { char: "ミョ", romaji: "myo" }] },
  { label: "リャ", kana: [{ char: "リャ", romaji: "rya" }, { char: "リュ", romaji: "ryu" }, { char: "リョ", romaji: "ryo" }] },
  { label: "ギャ", kana: [{ char: "ギャ", romaji: "gya" }, { char: "ギュ", romaji: "gyu" }, { char: "ギョ", romaji: "gyo" }] },
  { label: "ジャ", kana: [{ char: "ジャ", romaji: "ja" }, { char: "ジュ", romaji: "ju" }, { char: "ジョ", romaji: "jo" }] },
  { label: "ビャ", kana: [{ char: "ビャ", romaji: "bya" }, { char: "ビュ", romaji: "byu" }, { char: "ビョ", romaji: "byo" }] },
  { label: "ピャ", kana: [{ char: "ピャ", romaji: "pya" }, { char: "ピュ", romaji: "pyu" }, { char: "ピョ", romaji: "pyo" }] },
];
