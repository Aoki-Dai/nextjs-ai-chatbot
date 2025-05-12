export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'チャットモデル',
    description: '汎用的なチャット用の主要モデル',
  },
  {
    id: 'chat-model-reasoning',
    name: '推論モデル',
    description: '高度な推論能力を持つモデル',
  },
];
