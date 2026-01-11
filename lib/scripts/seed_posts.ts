import { createClient } from '@supabase/supabase-js';
import { STORY_DATA } from '../data/storyData';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Helper to load env vars if not automagically loaded by your framework
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  ''; // Use SERVICE_ROLE key for seeding to bypass RLS

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const seedPosts = async () => {
  console.log('Seeding sajulatte_posts...');

  const posts = Object.values(STORY_DATA).map((story) => ({
    id: story.id,
    category: story.category,
    title: story.title,
    description: story.desc,
    content: story.content,
    color_class: story.color,
    text_color_class: story.textColor,
    display_date: story.date.replace(/\./g, '-'), // Convert '2024.03.15' to '2024-03-15'
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from('sajulatte_posts')
    .upsert(posts, { onConflict: 'id' });

  if (error) {
    console.error('Error seeding posts:', error);
  } else {
    console.log(`Successfully seeded ${posts.length} posts!`);
  }
};

seedPosts();
