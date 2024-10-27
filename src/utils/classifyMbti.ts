export const classifyMbti = (
  answers: (boolean | string[])[][]
): { type: string; percentages: number[] } => {
  const percentages: number[] = [];

  // 各質問に対するカウントを初期化
  const counts = answers.map((answerSet) => {
    const trueCount = answerSet.filter((answer) => answer === true).length;
    const falseCount = answerSet.filter((answer) => answer === false).length;
    return { trueCount, falseCount };
  });

  // 各質問の割合を計算し、MBTIの要素を決定
  const classifications = counts.map(({ trueCount, falseCount }) => {
    const total = trueCount + falseCount;
    const ratio = total > 0 ? (trueCount / total) * 100 : 0; // 割合を計算
    percentages.push(ratio); // 割合を配列に追加

    // 50%以上の場合、trueの要素を選択
    return trueCount > falseCount ? true : false; // E/Iの判断
  });

  // 各質問に応じた要素を結合してMBTIタイプを作成
  const mbtiType = [
    classifications[0] === true ? "E" : "I", // E/I
    classifications[1] === true ? "S" : "N", // S/N
    classifications[2] === true ? "T" : "F", // T/F
    classifications[3] === true ? "J" : "P", // J/P
  ].join("");

  return { type: mbtiType, percentages };
};
