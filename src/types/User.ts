export interface User {
  id: string; // UUID, string 型
  name?: string; // ユーザー名, optional
  sex?: string; // 性別, optional (string 型に変更)
  events?: any; // ここを any に変更することで柔軟性を持たせることができる
  age?: string; // 年齢, optional (string 型に変更)
  place?: string; // 場所, optional
  mbti?: string; // MBTIタイプ, optional
  percentage?: string[]; // パーセンテージ, optional
  detail?: string; // 詳細, optional
  date?: string; // 日付, optional
  url?: string; // URL, optional
  event_id?: string; // イベントID, optional
  participants?: string; // 参加者, optional
  message?: string; // メッセージ, optional
  email?: string; // メールアドレス, optional
}
