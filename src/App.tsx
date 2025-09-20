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
  const total = results.length;
  const correctCount = useMemo(() => results.filter((r) => r.correct).length, [results]);
  const incorrectResults = useMemo(
    () => results.filter((r) => !r.correct),
    [results],
  );
  const score = total > 0 ? Math.round((100 * correctCount) / total) : 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">四字熟語ドリル（読み当て）</h1>
          <p className="text-sm text-neutral-300 mt-2">
            出題範囲（1〜x）から k 個をランダム出題。読み（ひらがな）を完全一致で判定します。
          </p>
        </header>

        {/* 設定カード */}
        {!started && (
          <div className="bg-neutral-900/80 backdrop-blur rounded-3xl p-8 shadow-xl border border-neutral-800 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-left">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
                  範囲上限 x（1〜{maxN}）
                </label>
                <input
                  type="number"
                  min={1}
                  max={maxN}
                  value={x}
                  onChange={(e) => setX(Number(e.target.value))}
                  className="w-full bg-neutral-800/70 border border-neutral-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">出題数 k</label>
                <input
                  type="number"
                  min={1}
                  max={maxN}
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="w-full bg-neutral-800/70 border border-neutral-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="sm:pt-8">
                <button
                  onClick={startQuiz}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 transition rounded-xl px-4 py-3 font-semibold shadow"
                >
                  Start
                </button>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-6 text-center">
              ヒント：x ≤ {maxN}、k ≤ x に自動調整されます。問題は同じ回で重複しません。
            </p>
          </div>
        )}

        {/* 出題ビュー */}
        {started && !finished && current && (
          <div className="bg-neutral-900/80 backdrop-blur rounded-3xl p-8 shadow-xl border border-neutral-800 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 text-sm text-neutral-400">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-lg bg-neutral-800 text-neutral-200 font-semibold">
                  {pos + 1} / {indices.length}
                </span>
                <span>現在の問題に集中しましょう！</span>
              </div>
              <button onClick={resetAll} className="self-start sm:self-auto text-neutral-300 hover:text-white transition">
                リセット
              </button>
            </div>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900 px-10 py-6 shadow-inner">
                <div className="text-4xl sm:text-5xl font-bold tracking-wide text-white drop-shadow">{current.kanji}</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="ひらがなで入力"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKey}
                className="w-full bg-neutral-800/70 border border-neutral-700 rounded-xl px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-indigo-400"
                autoCapitalize="none"
                autoComplete="off"
              />
              <button
                onClick={submitOne}
                className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition rounded-xl px-8 py-3 font-semibold text-white shadow"
              >
                決定 / Enter
              </button>
            </div>
          </div>
        )}

        {/* 結果ビュー */}
        {finished && (
          <div className="bg-neutral-900/80 backdrop-blur rounded-3xl p-8 shadow-xl border border-neutral-800 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">結果</h2>
                <p className="text-sm text-neutral-400 mt-1">正解率と回答内容をチェックしましょう。</p>
              </div>
              <button onClick={resetAll} className="text-sm text-neutral-300 hover:text-white transition">もう一度</button>
            </div>
            <div className="mb-6">
              <div
                className={`text-4xl font-black tracking-tight ${
                  score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400"
                }`}
              >
                {score}
                <span className="text-lg font-semibold text-neutral-200 ml-2">/ 100 点</span>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="rounded-2xl border border-emerald-600/60 bg-emerald-500/10 px-4 py-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-emerald-300">正解</div>
                  <div className="text-2xl font-bold text-emerald-400">{correctCount}</div>
                </div>
                <div className="rounded-2xl border border-red-600/60 bg-red-500/10 px-4 py-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-red-300">不正解</div>
                  <div className="text-2xl font-bold text-red-400">{incorrectResults.length}</div>
                </div>
                <div className="rounded-2xl border border-indigo-600/60 bg-indigo-500/10 px-4 py-3 text-center col-span-2 sm:col-span-1">
                  <div className="text-xs uppercase tracking-wide text-indigo-300">出題数</div>
                  <div className="text-2xl font-bold text-indigo-200">{total}</div>
                </div>
                <div className="rounded-2xl border border-neutral-700 px-4 py-3 text-center col-span-2 sm:col-span-1">
                  <div className="text-xs uppercase tracking-wide text-neutral-400">正解率</div>
                  <div className="text-2xl font-bold text-neutral-100">{total ? Math.round((correctCount / total) * 100) : 0}%</div>
                </div>
              </div>
            </div>

            {/* 間違い一覧 */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">間違えた問題</h3>
              {incorrectResults.length === 0 ? (
                <p className="text-emerald-400">全問正解！お見事です 🎉</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-800">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-neutral-900/80 text-neutral-300">
                      <tr>
                        <th className="py-3 px-4 border-b border-neutral-800">漢字</th>
                        <th className="py-3 px-4 border-b border-neutral-800">あなたの回答</th>
                        <th className="py-3 px-4 border-b border-neutral-800">正しい読み</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incorrectResults.map((r, i) => (
                        <tr key={i} className="odd:bg-neutral-950 even:bg-neutral-900/70">
                          <td className="py-3 px-4 border-b border-neutral-800 font-medium text-neutral-100">{r.kanji}</td>
                          <td className="py-3 px-4 border-b border-neutral-800 text-red-300">{r.answer || "(空)"}</td>
                          <td className="py-3 px-4 border-b border-neutral-800 text-emerald-300">{r.expected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 全体一覧（任意） */}
            <details className="mt-8 group">
              <summary className="cursor-pointer text-neutral-300 flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform">▶</span>
                <span>全回答を表示</span>
              </summary>
              <div className="overflow-x-auto mt-3 rounded-2xl border border-neutral-800">
                <table className="w-full text-sm text-left">
                  <thead className="bg-neutral-900/80 text-neutral-300">
                    <tr>
                      <th className="py-3 px-4 border-b border-neutral-800">#</th>
                      <th className="py-3 px-4 border-b border-neutral-800">漢字</th>
                      <th className="py-3 px-4 border-b border-neutral-800">あなたの回答</th>
                      <th className="py-3 px-4 border-b border-neutral-800">正誤</th>
                      <th className="py-3 px-4 border-b border-neutral-800">正しい読み</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="odd:bg-neutral-950 even:bg-neutral-900/70">
                        <td className="py-3 px-4 border-b border-neutral-800 text-neutral-400">{i + 1}</td>
                        <td className="py-3 px-4 border-b border-neutral-800 font-medium text-neutral-100">{r.kanji}</td>
                        <td
                          className={`py-3 px-4 border-b border-neutral-800 ${
                            r.correct ? "text-emerald-300" : "text-red-300"
                          }`}
                        >
                          {r.answer || "(空)"}
                        </td>
                        <td
                          className={`py-3 px-4 border-b border-neutral-800 font-bold ${
                            r.correct ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {r.correct ? "○" : "×"}
                        </td>
                        <td className="py-3 px-4 border-b border-neutral-800 text-neutral-200">{r.expected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {results.map((r, i) => (
                  <div
                    key={`${r.kanji}-${i}`}
                    className={`rounded-2xl border px-4 py-3 shadow-sm ${
                      r.correct
                        ? "border-emerald-500/60 bg-emerald-500/10"
                        : "border-red-500/60 bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wide text-neutral-400">#{i + 1}</span>
                      <span
                        className={`text-sm font-semibold ${
                          r.correct ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {r.correct ? "正解" : "不正解"}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-neutral-100">{r.kanji}</div>
                    <div className="mt-2">
                      <div className="text-xs text-neutral-400">あなたの回答</div>
                      <div className={r.correct ? "text-emerald-200 font-medium" : "text-red-200 font-medium"}>
                        {r.answer || "(空)"}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-neutral-400">正しい読み</div>
                      <div className="text-neutral-100 font-medium">{r.expected}</div>
                    </div>
                  </div>
                ))}
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
