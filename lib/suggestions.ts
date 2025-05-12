import type { UIMessage } from 'ai';

export function generateSuggestions(message: UIMessage): string[] {
  // メッセージの内容を取得
  const content = message.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join(' ');

  if (!content) return [];

  // 基本的なサジェスト
  const baseSuggestions = [
    'もっと詳しく教えてください',
    '具体的な例を挙げてください',
  ];

  // コンテンツに基づいて追加のサジェストを生成
  const additionalSuggestions: string[] = [];

  // 食事に関する内容
  if (content.includes('食事') || content.includes('料理') || content.includes('レストラン')) {
    additionalSuggestions.push('おすすめのレシピを教えてください');
    additionalSuggestions.push('近くのおすすめのお店を教えてください');
    additionalSuggestions.push('健康的な食事のアドバイスをください');
  }

  // 健康や運動に関する内容
  if (content.includes('健康') || content.includes('運動') || content.includes('ダイエット')) {
    additionalSuggestions.push('簡単にできる運動を教えてください');
    additionalSuggestions.push('健康的な生活習慣のアドバイスをください');
    additionalSuggestions.push('ストレス解消法を教えてください');
  }

  // 買い物やファッションに関する内容
  if (content.includes('買い物') || content.includes('ファッション') || content.includes('服')) {
    additionalSuggestions.push('おすすめのアイテムを教えてください');
    additionalSuggestions.push('コーディネートのアドバイスをください');
    additionalSuggestions.push('お得な買い物のコツを教えてください');
  }

  // 旅行やレジャーに関する内容
  if (content.includes('旅行') || content.includes('観光') || content.includes('レジャー')) {
    additionalSuggestions.push('おすすめの観光スポットを教えてください');
    additionalSuggestions.push('旅行の準備リストを作ってください');
    additionalSuggestions.push('予算に合わせた旅行プランを提案してください');
  }

  // 仕事やキャリアに関する内容
  if (content.includes('仕事') || content.includes('キャリア') || content.includes('就職')) {
    additionalSuggestions.push('仕事の効率化のコツを教えてください');
    additionalSuggestions.push('キャリアアップのアドバイスをください');
    additionalSuggestions.push('ワークライフバランスの取り方を教えてください');
  }

  // 趣味や娯楽に関する内容
  if (content.includes('趣味') || content.includes('娯楽') || content.includes('楽しみ')) {
    additionalSuggestions.push('新しい趣味の提案をしてください');
    additionalSuggestions.push('趣味を始めるためのアドバイスをください');
    additionalSuggestions.push('趣味を通じた交流の方法を教えてください');
  }

  // 住まいやインテリアに関する内容
  if (content.includes('住まい') || content.includes('インテリア') || content.includes('家具')) {
    additionalSuggestions.push('おすすめのインテリアアイデアを教えてください');
    additionalSuggestions.push('収納のコツを教えてください');
    additionalSuggestions.push('快適な住まいづくりのアドバイスをください');
  }

  // 人間関係やコミュニケーションに関する内容
  if (content.includes('人間関係') || content.includes('コミュニケーション') || content.includes('友人')) {
    additionalSuggestions.push('人間関係を良くするコツを教えてください');
    additionalSuggestions.push('コミュニケーションの改善方法を教えてください');
    additionalSuggestions.push('新しい出会いの作り方を教えてください');
  }

  // 時間管理やスケジュールに関する内容
  if (content.includes('時間') || content.includes('スケジュール') || content.includes('予定')) {
    additionalSuggestions.push('効率的な時間の使い方を教えてください');
    additionalSuggestions.push('スケジュール管理のコツを教えてください');
    additionalSuggestions.push('仕事とプライベートのバランスの取り方を教えてください');
  }

  // 最大4つのサジェストを返す
  return [...baseSuggestions, ...additionalSuggestions].slice(0, 4);
} 