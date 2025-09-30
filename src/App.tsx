import React, { useMemo, useState, useEffect, useRef } from "react";
import "./App.css";

/**
 * 四字熟語 学習ページ
 * ---------------------------------------------
 * • 下の `IDIOMS` 配列に 133 個の { kanji, reading } を入れてください（reading は ひらがな）。
 * • 画面上部で 出題範囲（開始・終了）と k（出題数）を入力 → Start でランダム出題。
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

function sampleWithoutReplacement<T>(source: T[], k: number): T[] {
  const arr = [...source];
  for (let i = arr.length - 1; i > 0; i--) {
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function YojijukugoDrill() {
  const maxN = IDIOMS.length;
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(() => Math.min(10, maxN));
  const [k, setK] = useState(5);
  const [indices, setIndices] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedRange = useMemo(() => {
    const clampedStart = clamp(rangeStart, 1, maxN);
    const clampedEnd = clamp(rangeEnd, 1, maxN);
    return {
      start: Math.min(clampedStart, clampedEnd),
      end: Math.max(clampedStart, clampedEnd),
    };
  }, [rangeStart, rangeEnd, maxN]);

  useEffect(() => {
    if (started && inputRef.current) inputRef.current.focus();
  }, [started, pos]);

  const current = useMemo(() => {
    if (!started || pos >= indices.length) return null;
    const idx = indices[pos];
    return IDIOMS[idx];
  }, [started, pos, indices]);

  function startQuiz() {
    const clampedStart = clamp(rangeStart, 1, maxN);
    const clampedEnd = clamp(rangeEnd, 1, maxN);
    const start = Math.min(clampedStart, clampedEnd);
    const end = Math.max(clampedStart, clampedEnd);
    const rangeSize = end - start + 1;
    const safeK = Math.max(1, Math.min(k, rangeSize));
    const rangeIndices = Array.from({ length: rangeSize }, (_, i) => start - 1 + i);
    const pool = sampleWithoutReplacement(rangeIndices, safeK);
    setRangeStart(start);
    setRangeEnd(end);
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

  const scoreClass =
    score >= 80
      ? "score-display__value answer--correct"
      : score >= 50
        ? "score-display__value score-display__value--warning"
        : "score-display__value answer--incorrect";

  return (
    <div className="app">
      <div className="app__wrapper">
        <header className="app__header">
          <h1 className="app__title">四字熟語ドリル（読み当て）</h1>
          <p className="app__subtitle">
            出題範囲（＃{normalizedRange.start}〜＃{normalizedRange.end}）から k 個をランダム出題。
            読み（ひらがな）を完全一致で判定します。
          </p>
        </header>

        {!started && (
          <div className="card card--settings">
            <div className="settings-grid">
              <div className="field">
                <label className="field__label">範囲下限（1〜{maxN}）</label>
                <input
                  type="number"
                  min={1}
                  max={maxN}
                  value={rangeStart}
                  onChange={(e) => setRangeStart(clamp(Number(e.target.value), 1, maxN))}
                  className="field__input"
                />
              </div>
              <div className="field">
                <label className="field__label">範囲上限（1〜{maxN}）</label>
                <input
                  type="number"
                  min={1}
                  max={maxN}
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(clamp(Number(e.target.value), 1, maxN))}
                  className="field__input"
                />
              </div>
              <div className="field">
                <label className="field__label">出題数 k</label>
                <input
                  type="number"
                  min={1}
                  max={maxN}
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  className="field__input"
                />
              </div>
              <div className="settings-grid__actions">
                <button onClick={startQuiz} className="button button--primary">
                  開始
                </button>
              </div>
            </div>
            <p className="hint">
              ヒント：範囲は 1〜{maxN} に収まり、開始＞終了なら自動的に入れ替わります。k も範囲内に
              調整され、問題は同じ回で重複しません。
            </p>
          </div>
        )}

        {started && !finished && current && (
          <div className="card card--quiz">
            <div className="quiz-header">
              <div className="quiz-meta">
                <span className="quiz-meta__count">
                  {pos + 1} / {indices.length}
                </span>
                <span className="quiz-meta__message">問題に集中しましょう！</span>
              </div>
              <button onClick={resetAll} className="button button--ghost">
                リセット
              </button>
            </div>
            <div className="quiz-prompt">
              <div className="quiz-kanji">{current.kanji}</div>
            </div>
            <div className="quiz-actions">
              <input
                ref={inputRef}
                type="text"
                placeholder="ひらがなで入力"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKey}
                className="field__input field__input--answer"
                autoCapitalize="none"
                autoComplete="off"
              />
              <button onClick={submitOne} className="button button--confirm">
                決定 / Enter
              </button>
            </div>
          </div>
        )}

        {finished && (
          <div className="card card--results">
            <div className="results-header">
              <div>
                <h2 className="results-title">結果</h2>
                <p className="results-subtitle">正解率と回答内容をチェックしましょう。</p>
              </div>
              <button onClick={resetAll} className="button button--ghost">
                もう一度
              </button>
            </div>
            <div className="score-display">
              <div className={scoreClass}>
                {score}
                <span className="score-display__suffix">/ 100 点</span>
              </div>
              <div className="result-grid">
                <div className="result-grid__item result-grid__item--correct">
                  <div className="result-grid__label">正解</div>
                  <div className="result-grid__value answer--correct">{correctCount}</div>
                </div>
                <div className="result-grid__item result-grid__item--incorrect">
                  <div className="result-grid__label">不正解</div>
                  <div className="result-grid__value answer--incorrect">{incorrectResults.length}</div>
                </div>
                <div className="result-grid__item">
                  <div className="result-grid__label">出題数</div>
                  <div className="result-grid__value">{total}</div>
                </div>
                <div className="result-grid__item">
                  <div className="result-grid__label">正解率</div>
                  <div className="result-grid__value">{total ? Math.round((correctCount / total) * 100) : 0}%</div>
                </div>
              </div>
            </div>

            <div className="mistakes">
              <h3 className="mistakes__title">間違えた問題</h3>
              {incorrectResults.length === 0 ? (
                <p className="message message--success">全問正解！お見事です 🎉</p>
              ) : (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">漢字</th>
                        <th scope="col">あなたの回答</th>
                        <th scope="col">正しい読み</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incorrectResults.map((r, i) => (
                        <tr key={i}>
                          <td className="data-table__cell data-table__cell--strong">{r.kanji}</td>
                          <td className="data-table__cell answer--incorrect">{r.answer || "(空)"}</td>
                          <td className="data-table__cell answer--correct">{r.expected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <details className="answers">
              <summary className="answers__summary">
                <span className="answers__icon" aria-hidden>▶</span>
                <span>全回答を表示</span>
              </summary>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">漢字</th>
                      <th scope="col">あなたの回答</th>
                      <th scope="col">正誤</th>
                      <th scope="col">正しい読み</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td className="data-table__cell data-table__cell--muted">{i + 1}</td>
                        <td className="data-table__cell data-table__cell--strong">{r.kanji}</td>
                        <td className={`data-table__cell ${r.correct ? "answer--correct" : "answer--incorrect"}`}>
                          {r.answer || "(空)"}
                        </td>
                        <td
                          className={`data-table__cell data-table__cell--status ${
                            r.correct ? "answer--correct" : "answer--incorrect"
                          }`}
                        >
                          {r.correct ? "○" : "×"}
                        </td>
                        <td className="data-table__cell">{r.expected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="answer-cards">
                {results.map((r, i) => (
                  <div
                    key={`${r.kanji}-${i}`}
                    className={`answer-card ${r.correct ? "answer--correct" : "answer--incorrect"}`}
                  >
                    <div className="answer-card__header">
                      <span className="answer-card__number">#{i + 1}</span>
                      <span className="answer-card__status">{r.correct ? "正解" : "不正解"}</span>
                    </div>
                    <div className="answer-card__kanji">{r.kanji}</div>
                    <div className="answer-card__section">
                      <div className="answer-card__label">あなたの回答</div>
                      <div className="answer-card__value">{r.answer || "(空)"}</div>
                    </div>
                    <div className="answer-card__section">
                      <div className="answer-card__label">正しい読み</div>
                      <div className="answer-card__value answer-card__value--expected">{r.expected}</div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        <footer className="app__footer">
          <p>読みの比較は「カタカナ→ひらがな」と「空白削除」の後に判定されです。</p>
        </footer>
      </div>
    </div>
  );
}
