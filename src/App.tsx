import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * 四字熟語 学習ページ
 * ---------------------------------------------
 * • 下の `IDIOMS` 配列に 133 個の { kanji, reading } を入れてください（reading は ひらがな）。
 * • 画面上部で x（出題範囲: 1〜x）と k（出題数）を入力 → Start でランダム出題。
 * • 完全一致（ひらがな・全半角／カタカナ→ひらがな正規化後）で正解。
 * • 最後に間違い一覧と採点を表示します。
 *
 * 使い方メモ：
 *  - 読みは「ぜんぜん」など、かなのみ。濁点・促音・長音も かな に含めてください。
 *  - 例：『起死回生』 => 「きしかいせい」
 */

// ✅ ここに 133 個入れてください（サンプルを数件だけ入れてあります）
const IDIOMS: { kanji: string; reading: string }[] = [ { kanji: "悪口雑言", reading: "あっこうぞうごん" }, 
  { kanji: "暗中模索", reading: "あんちゅうもさく" }, { kanji: "意気消沈", reading: "いきしょうちん" }, 
  { kanji: "意気投合", reading: "いきとうごう" }, { kanji: "意気揚々", reading: "いきようよう" }, 
  { kanji: "異口同音", reading: "いくどうおん" }, { kanji: "以心伝心", reading: "いしんでんしん" }, 
  { kanji: "一言居士", reading: "いちげんこじ" }, { kanji: "一期一会", reading: "いちごいちえ" }, 
  { kanji: "一日千秋", reading: "いちじつせんしゅう" }, { kanji: "一念発起", reading: "いちねんほっき" },
   { kanji: "一望千里", reading: "いちぼうせんり" }, { kanji: "一網打尽", reading: "いちもうだじん" }, 
   { kanji: "一目瞭然", reading: "いちもくりょうぜん" }, { kanji: "一蓮托生", reading: "いちれんたくしょう" }, 
  { kanji: "一攫千金", reading: "いっかくせんきん" }, { kanji: "一喜一憂", reading: "いっきいちゆう" }, 
  { kanji: "一騎当千", reading: "いっきとうせん" }, { kanji: "一生懸命", reading: "いっしょうけんめい" }, 
  { kanji: "一触即発", reading: "いっしょくそくはつ" }, { kanji: "一進一退", reading: "いっしんいったい" }, 
  { kanji: "一心同体", reading: "いっしんどうたい" }, { kanji: "一心不乱", reading: "いっしんふらん" }, 
  { kanji: "一石二鳥", reading: "いっせきにちょう" }, { kanji: "因果応報", reading: "いんがおうほう" }, 
  { kanji: "慇懃無礼", reading: "いんぎんぶれい" }, { kanji: "右往左往", reading: "うおうさおう" }, 
  { kanji: "海千山千", reading: "うみせんやません" }, { kanji: "紆余曲折", reading: "うよきょくせつ" }, 
  { kanji: "雲散霧消", reading: "うんさんむしょう" }, { kanji: "岡目八目", reading: "おかめはちもく" }, 
  { kanji: "開口一番", reading: "かいこういちばん" }, { kanji: "我田引水", reading: "がでんいんすい" }, 
  { kanji: "冠婚葬祭", reading: "かんこんそうさい" }, { kanji: "完全無欠", reading: "かんぜんむけつ" }, 
  { kanji: "艱難辛苦", reading: "かんなんしんく" }, { kanji: "危機一髪", reading: "ききいっぱつ" }, 
  { kanji: "起死回生", reading: "きしかいせい" }, { kanji: "起承転結", reading: "きしょうてんけつ" }, 
  { kanji: "喜色満面", reading: "きしょくまんめん" }, { kanji: "奇想天外", reading: "きそうてんがい" }, 
  { kanji: "急転直下", reading: "きゅうてんちょっか" }, { kanji: "器用貧乏", reading: "きようびんぼう" }, 
  { kanji: "興味津々", reading: "きょうみしんしん" }, { kanji: "空前絶後", reading: "くうぜんぜつご" },
  { kanji: "厚顔無恥", reading: "こうがんむち" }, { kanji: "広大無辺", reading: "こうだいむへん" }, 
  { kanji: "口頭試問", reading: "こうとうしもん" }, { kanji: "荒唐無稽", reading: "こうとうむけい" }, 
  { kanji: "公平無視", reading: "こうへいむし" }, { kanji: "公明正大", reading: "こうめいせいだい" }, 
  { kanji: "古今東西", reading: "ここんとうざい" }, { kanji: "孤立無援", reading: "こりつむえん" }, 
  { kanji: "言語道断", reading: "ごんごどうだん" }, { kanji: "再三再四", reading: "さいさんさいし" }, 
  { kanji: "才色兼備", reading: "さいしょくけんび" }, { kanji: "三寒四温", reading: "さんかんしおん" },
  { kanji: "三々五々", reading: "さんさんごご" }, { kanji: "山紫水明", reading: "さんしすいめい" }, 
  { kanji: "三拝九拝", reading: "さんぱいきゅうはい" }, { kanji: "自画自賛", reading: "じがじさん" }, 
  { kanji: "自給自足", reading: "じきゅうじそく" }, { kanji: "四苦八苦", reading: "しくはっく" }, 
  { kanji: "試行錯誤", reading: "しこうさくご" }, { kanji: "自業自得", reading: "じごうじとく" },
  { kanji: "七顛八起", reading: "しちてんはっき" }, { kanji: "弱肉強食", reading: "じゃくにくきょうしょく" },
  { kanji: "終始一貫", reading: "しゅうしいっかん" }, { kanji: "十人十色", reading: "じゅうにんといろ" }, 
  { kanji: "主客転倒", reading: "しゅかくてんとう" }, { kanji: "取捨選択", reading: "しゅしゃせんたく" }, 
  { kanji: "順風満帆", reading: "じゅんぷうまんぱん" }, { kanji: "枝葉末節", reading: "しようまっせつ" }, 
  { kanji: "心機一転", reading: "しんきいってん" }, { kanji: "針小棒大", reading: "しんしょうぼうだい" }, 
  { kanji: "森羅万象", reading: "しんらばんしょう" }, { kanji: "晴耕雨読", reading: "せいこううどく" }, 
  { kanji: "正々堂々", reading: "せいせいどうどう" }, { kanji: "青天白日", reading: "せいてんはくじつ" },
  { kanji: "絶体絶命", reading: "ぜったいぜつめい" }, { kanji: "千差万別", reading: "せんさばんべつ" }, 
  { kanji: "前人未到", reading: "ぜんじんみとう" }, { kanji: "前代未聞", reading: "ぜんだいみもん" },
  { kanji: "先手必勝", reading: "せんてひっしょう" }, { kanji: "千変万化", reading: "せんぺんばんか" }, 
  { kanji: "大義名分", reading: "たいぎめいぶん" }, { kanji: "大言壮語", reading: "たいげんそうご" },
  { kanji: "泰然自若", reading: "たいぜんじじゃく" }, { kanji: "大胆不敵", reading: "だいたんふてき" }, 
  { kanji: "大同小異", reading: "だいどうしょうい" }, { kanji: "他力本願", reading: "たりきほんがん" },
  { kanji: "適材適所", reading: "てきざいてきしょ" }, { kanji: "手前味噌", reading: "てまえみそ" },
  { kanji: "天真爛漫", reading: "てんしんらんまん" }, { kanji: "天変地異", reading: "てんぺんちい" },
  { kanji: "当意即妙", reading: "とういそくみょう" }, { kanji: "東奔西走", reading: "とうほんせいそう" },
  { kanji: "二束三文", reading: "にそくさんもん" }, { kanji: "日進月歩", reading: "にっしんげっぽ" }, 
  { kanji: "破顔一笑", reading: "はがんいっしょう" }, { kanji: "博覧強記", reading: "はくらんきょうき" },
  { kanji: "八方美人", reading: "はっぽうびじん" }, { kanji: "波乱万丈", reading: "はらんばんじょう" }, 
  { kanji: "半死半生", reading: "はんしはんしょう" }, { kanji: "半信半疑", reading: "はんしんはんぎ" },
  { kanji: "美辞麗句", reading: "びじれいく" }, { kanji: "百発百中", reading: "ひゃっぱつひゃくちゅう" },
  { kanji: "不言実行", reading: "ふげんじっこう" }, { kanji: "不眠不休", reading: "ふみんふきゅう" },
  { kanji: "平身低頭", reading: "へいしんていとう" }, { kanji: "本末転倒", reading: "ほんまつてんとう" }, 
  { kanji: "満場一致", reading: "まんじょういっち" }, { kanji: "三日坊主", reading: "みっかぼうず" }, 
  { kanji: "無我夢中", reading: "むがむちゅう" }, { kanji: "無病息災", reading: "むびょうそくさい" }, 
  { kanji: "無味乾燥", reading: "むみかんそう" }, { kanji: "無理難題", reading: "むりなんだい" },
  { kanji: "門外不出", reading: "もんがいふしゅつ" }, { kanji: "問答無用", reading: "もんどうむよう" }, 
  { kanji: "唯一無二", reading: "ゆいいつむに" }, { kanji: "優柔不断", reading: "ゆうじゅうふだん" }, 
  { kanji: "勇猛果敢", reading: "ゆうもうかかん" }, { kanji: "悠々自適", reading: "ゆうゆうじてき" }, 
  { kanji: "油断大敵", reading: "ゆだんたいてき" }, { kanji: "用意周到", reading: "よういしゅうとう" }, 
  { kanji: "容姿端麗", reading: "ようしたんれい" }, { kanji: "利害得失", reading: "りがいとくしつ" }, 
  { kanji: "離合集散", reading: "りごうしゅうさん" }, { kanji: "立身出世", reading: "りっしんしゅっせ" }, 
  { kanji: "流言飛語", reading: "りゅうげんひご" }, { kanji: "理路整然", reading: "りろせいぜん" }, 
  { kanji: "老若男女", reading: "ろうにゃくなんにょ" }, ];

// --- ユーティリティ：入力正規化（空白除去・全半角統一・カタカナ→ひらがな） ---
function toHiragana(str: string): string {
  let s = str.trim().replace(/\s+/g, "").replace(/[\u3000]/g, "");
  s = s.replace(/[\u30A1-\u30F6]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60));
  return s;
}

function sampleWithoutReplacement(n: number, k: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, k);
}

interface ResultItem {
  kanji: string;
  expected: string; // ひらがな
  answer: string;   // 生入力
  correct: boolean;
}

export default function YojijukugoDrill() {
  const [x, setX] = useState(10);
  const [k, setK] = useState(5);
  const [indices, setIndices] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxN = IDIOMS.length;

  useEffect(() => {
    if (started && inputRef.current) inputRef.current.focus();
  }, [started, pos]);

  const current = useMemo(() => {
    if (!started || pos >= indices.length) return null;
    const idx = indices[pos];
    return IDIOMS[idx];
  }, [started, pos, indices]);

  function startQuiz() {
    const safeX = Math.max(1, Math.min(x, maxN));
    const safeK = Math.max(1, Math.min(k, safeX));
    const pool = sampleWithoutReplacement(safeX, safeK);
    setIndices(pool);
    setResults([]);
    setPos(0);
    setAnswer("");
    setStarted(true);
  }

  function submitOne() {
    if (!current) return;
    const expected = toHiragana(current.reading);
    const normalized = toHiragana(answer);
    const ok = normalized === expected;
    setResults((prev) => [
      ...prev,
      { kanji: current.kanji, expected, answer, correct: ok },
    ]);
    setAnswer("");
    setPos((p) => p + 1);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submitOne();
  }

  function resetAll() {
    setStarted(false);
    setIndices([]);
    setResults([]);
    setPos(0);
    setAnswer("");
  }

  const finished = started && pos >= indices.length && indices.length > 0;
  const correctCount = results.filter((r) => r.correct).length;
  const total = results.length;
  const score = total > 0 ? Math.round((100 * correctCount) / total) : 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex justify-center items-center p-6">
      <div className="w-full max-w-3xl text-center">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">四字熟語ドリル（読み当て）</h1>
          <p className="text-sm text-neutral-300 mt-1">
            出題範囲（1〜x）から k 個をランダム出題。読み（ひらがな）を完全一致で判定します。
          </p>
        </header>

        {/* 設定カード */}
        {!started && (
          <div className="bg-neutral-900 rounded-2xl p-6 shadow mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">範囲上限 x（1〜{maxN}）</label>
                <input
                  type="number"
                  min={1}
                  max={maxN}
                  value={x}
                  onChange={(e) => setX(Number(e.target.value))}
                  className="w-full bg-neutral-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">出題数 k</label>
                <input
                  type="number"
                  min={1}
                  max={maxN}
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="w-full bg-neutral-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:pt-6">
                <button
                  onClick={startQuiz}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition rounded-xl px-4 py-2 font-semibold"
                >
                  Start
                </button>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-3">
              ヒント：x ≤ {maxN}、k ≤ x に自動調整されます。問題は同じ回で重複しません。
            </p>
          </div>
        )}

        {/* 出題ビュー */}
        {started && !finished && current && (
          <div className="bg-neutral-900 rounded-2xl p-6 shadow mt-4 mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-neutral-400">{pos + 1} / {indices.length}</div>
              <button onClick={resetAll} className="text-sm text-neutral-300 hover:text-white">リセット</button>
            </div>
            <div className="text-center py-6">
              <div className="text-4xl sm:text-5xl font-bold tracking-wide">{current.kanji}</div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <input
                ref={inputRef}
                type="text"
                placeholder="ひらがなで入力"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKey}
                className="w-full bg-neutral-800 rounded-xl px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-indigo-500"
                autoCapitalize="none"
                autoComplete="off"
              />
              <button
                onClick={submitOne}
                className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition rounded-xl px-6 py-3 font-semibold text-white"
              >
                決定 / Enter
              </button>
            </div>
          </div>
        )}

        {/* 結果ビュー */}
        {finished && (
          <div className="bg-neutral-900 rounded-2xl p-6 shadow mt-4 mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">結果</h2>
              <button onClick={resetAll} className="text-sm text-neutral-300 hover:text-white">もう一度</button>
            </div>
            <div className="mb-4">
              <div className={`text-3xl font-extrabold ${score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                {score} <span className="text-lg font-semibold text-neutral-200">/ 100 点</span>
              </div>
              <div className="text-neutral-300 mt-1">
                正解 <span className="font-semibold text-emerald-400">{correctCount}</span>
                <span className="mx-1 text-neutral-500">/</span>
                <span className="font-semibold text-neutral-100">{total}</span>
                </div>
            </div>

            {/* 間違い一覧 */}
            <div>
              <h3 className="font-semibold mb-2">間違えた問題</h3>
              {results.filter((r) => !r.correct).length === 0 ? (
                <p className="text-emerald-400">全問正解！お見事です 🎉</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mx-auto border border-neutral-800 rounded-xl overflow-hidden">
                    <thead className="text-left text-neutral-300 bg-neutral-900">
                      <tr>
                        <th className="py-2 px-3 border border-neutral-800">漢字</th>
                        <th className="py-2 px-3 border border-neutral-800">あなたの回答</th>
                        <th className="py-2 px-3 border border-neutral-800">正しい読み</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.filter((r) => !r.correct).map((r, i) => (
                        <tr key={i} className="odd:bg-neutral-950 even:bg-neutral-900">
                          <td className="py-2 px-3 border border-neutral-800 font-medium">{r.kanji}</td>
                          <td className="py-2 px-3 border border-neutral-800 text-red-300">{r.answer || "(空)"}</td>
                          <td className="py-2 px-3 border border-neutral-800 text-emerald-300">{r.expected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 全体一覧（任意） */}
            <details className="mt-5">
              <summary className="cursor-pointer text-neutral-300">全回答を表示</summary>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm mx-auto border border-neutral-800 rounded-xl overflow-hidden">
                  <thead className="text-left text-neutral-300 bg-neutral-900">
                    <tr>
                      <th className="py-2 px-3 border border-neutral-800">#</th>
                      <th className="py-2 px-3 border border-neutral-800">漢字</th>
                      <th className="py-2 px-3 border border-neutral-800">あなたの回答</th>
                      <th className="py-2 px-3 border border-neutral-800">正誤</th>
                      <th className="py-2 px-3 border border-neutral-800">正しい読み</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="odd:bg-neutral-950 even:bg-neutral-900">
                        <td className="py-2 px-3 border border-neutral-800">{i + 1}</td>
                        <td className="py-2 px-3 border border-neutral-800 font-medium">{r.kanji}</td>
                        <td className={`py-2 px-3 border border-neutral-800 ${r.correct ? "text-emerald-300" : "text-red-300"}`}>{r.answer || "(空)"}</td>
                        <td className={`py-2 px-3 border border-neutral-800 font-bold ${r.correct ? "text-emerald-400" : "text-red-400"}`}>{r.correct ? "○" : "×"}</td>
                        <td className="py-2 px-3 border border-neutral-800">{r.expected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        )}

        <footer className="text-xs text-neutral-500 mt-8 text-center">
          <p>読みの比較は「カタカナ→ひらがな」「空白削除」の正規化後に厳密一致です。</p>
        </footer>
      </div>
    </div>
  );
}
