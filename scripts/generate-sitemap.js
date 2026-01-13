const fs = require('fs');
const path = require('path');

// Load environment variables from specific path to avoid issues when running from scripts/ dir
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');

// 1. Setup Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Error: EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY is missing in .env'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Define Static URLs (Provided by User)
const staticUrls = [
  { loc: 'https://sajulatte.app/', changefreq: 'daily', priority: '1.0' },
  { loc: 'https://sajulatte.app/daily', changefreq: 'daily', priority: '0.8' },
  { loc: 'https://sajulatte.app/compatibility', changefreq: 'weekly', priority: '0.8' },
  { loc: 'https://sajulatte.app/compatibility/analysis', changefreq: 'weekly', priority: '0.7' },
  { loc: 'https://sajulatte.app/settings', changefreq: 'weekly', priority: '0.5' },
  { loc: 'https://sajulatte.app/preferences', changefreq: 'monthly', priority: '0.3' },
  { loc: 'https://sajulatte.app/privacy', changefreq: 'monthly', priority: '0.3' },
  { loc: 'https://sajulatte.app/terms', changefreq: 'monthly', priority: '0.3' },
  { loc: 'https://sajulatte.app/pillarscalendar', changefreq: 'weekly', priority: '0.7' },
  { loc: 'https://sajulatte.app/encyclopedia', changefreq: 'weekly', priority: '0.7' },
  { loc: 'https://sajulatte.app/amulet', changefreq: 'weekly', priority: '0.6' },
];

async function generateSitemap() {
  console.log('Generating sitemap...');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // 3. Add Static Pages
  staticUrls.forEach((url) => {
    xml += `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
  });

  // 4. Add Dynamic Pages (Stories from DB)
  try {
    console.log("Fetching stories from 'sajulatte_posts'...");

    // Fetch all IDs and updated_at from sajulatte_posts
    const { data: stories, error } = await supabase
      .from('sajulatte_posts')
      .select('id, updated_at');

    if (error) {
      console.warn('Warning: Failed to fetch stories from DB.', error.message);
    } else if (stories && stories.length > 0) {
      console.log(`Found ${stories.length} stories.`);

      stories.forEach((story) => {
        const lastmod = story.updated_at
          ? new Date(story.updated_at).toISOString().split('T')[0] // YYYY-MM-DD
          : new Date().toISOString().split('T')[0];

        xml += `  <url>
    <loc>https://sajulatte.app/story/${story.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${lastmod}</lastmod>
  </url>
`;
      });
    } else {
      console.log('No stories found in DB.');
    }
  } catch (e) {
    console.error('Unexpected error fetching from DB:', e);
  }

  // 5. Close XML
  xml += `</urlset>`;

  // 6. Write to file
  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, { encoding: 'utf-8' });

  console.log(`Sitemap generated successfully at ${outputPath}`);
}

generateSitemap();
