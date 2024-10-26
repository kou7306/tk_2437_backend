export interface Recruitment {
  id: string; // IDはUUID形式の文字列
  created_at: Date; // 作成日時
  title?: string; // タイトル（任意）
  detail?: string; // 詳細（任意）
  name?: string; // 名前（任意）
  date?: Date; // 日付（任意）
  sum?: bigint; // 合計（任意）
  participants?: string[]; // 参加者（文字列の配列）
  tags?: string[]; // タグ（文字列の配列）
  owner_id?: string; // オーナーID（任意）
  event_url?: string; // イベントURL（任意）
}
