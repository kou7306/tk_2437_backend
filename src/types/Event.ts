export interface Event {
  name: string; // イベント名
  detail?: string; // イベント詳細
  place?: string; // 開催場所
  period?: {
    start?: string; // 開始日（例: "2024-10-01"）
    end?: string; // 終了日（例: "2024-10-10"）
  };
  tags?: string[]; // タグ
  url?: string; // イベントのURL
  mbti?: string; // MBTI
}
