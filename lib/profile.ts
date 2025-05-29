import { auth } from '@/app/(auth)/auth';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUserProfile() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userProfile = await db
    .select({
      aiPreferences: user.aiPreferences,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return userProfile[0] || null;
}

export function createSystemPromptWithProfile(aiPreferences?: string | null) {
  let systemPrompt = `あなたはChoiceBuddy、親しみやすく知識豊富なAIアシスタントです。ユーザーの質問に対して、正確で有用な情報を提供してください。`;

  if (aiPreferences) {
    systemPrompt += `\n\nユーザーの求める特徴: ${aiPreferences}\n上記の特徴を考慮して、ユーザーの好みに合った回答スタイルでお答えください。`;
  }

  return systemPrompt;
}
