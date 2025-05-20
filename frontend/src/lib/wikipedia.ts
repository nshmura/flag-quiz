type CountryInfo = {
  description: string | null;
  specialties: string | null;
  attractions: string | null;
};

export async function getCountryInfo(countryName: string): Promise<CountryInfo> {
  try {
    // 日本語版WikipediaのAPIエンドポイント
    const url = `https://ja.wikipedia.org/w/api.php?` +
      `action=query` +
      `&format=json` +
      `&prop=extracts` +
      `&exintro=1` +
      `&explaintext=1` +
      `&titles=${encodeURIComponent(countryName)}` +
      `&origin=*`;

    const response = await fetch(url);
    const data = await response.json();

    // ページIDを取得
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    // 説明文を取得
    const extract = pages[pageId].extract;

    if (!extract) {
      return {
        description: null,
        specialties: null,
        attractions: null
      };
    }

    // テキストを分割して情報を抽出
    const text = extract.replace(/\n/g, ' ');
    const sentences = text.split(/[。．]/).filter(s => s.trim().length > 0);

    // 基本情報（最初の2文）
    const description = sentences.slice(0, 2).join('。') + '。';

    // 名産物や特産品に関する情報を探す
    const specialtyKeywords = ['特産', '名産', '産物', '生産', '輸出', '農産物', '海産物'];
    const specialties = sentences.find(s => 
      specialtyKeywords.some(keyword => s.includes(keyword))
    ) || null;

    // 観光地や見どころに関する情報を探す
    const attractionKeywords = ['観光', '見どころ', '観光地', '世界遺産', '名所', '遺跡', '博物館'];
    const attractions = sentences.find(s => 
      attractionKeywords.some(keyword => s.includes(keyword))
    ) || null;

    return {
      description,
      specialties: specialties ? specialties + '。' : null,
      attractions: attractions ? attractions + '。' : null
    };
  } catch (error) {
    console.error('Wikipediaの情報を取得できませんでした:', error);
    return {
      description: null,
      specialties: null,
      attractions: null
    };
  }
} 