const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://sajulatte.app';
const TODAY = new Date().toISOString().split('T')[0];

// 1. Static Routes
const staticRoutes = [
  '',
  '/saju',
  '/saju/result', // Dynamic but accessible
  '/compatibility',
  '/pillarscalendar',
  '/blog',
  '/privacy',
  '/terms',
];

// 2. Blog Post IDs (Extracted from app/blog/index.tsx)
const blogIds = [
  'what-is-saju',
  'ten-heavenly-stems',
  'twelve-earthly-branches',
  'five-elements-basics',
  'day-lord-analysis',
  'yearly-fortune',
  'marriage-compatibility',
  'career-guidance',
  'wealth-luck',
  'health-fortune',
  'ten-gods-bijian',
  'ten-gods-jie-cai',
  'ten-gods-shi-shen',
  'ten-gods-shang-guan',
  'ten-gods-pian-cai',
  'ten-gods-zheng-cai',
  'ten-gods-pian-guan',
  'ten-gods-zheng-guan',
  'ten-gods-pian-yin',
  'ten-gods-zheng-yin',
  'twelve-growth-stars',
  'strong-weak-chart',
  'find-yongshin',
  'peach-blossom',
  'traveling-horse',
  'saju-mbti',
  '2026-forecast',
  'education-saju',
  'moving-day',
  'lucky-colors',
];

// Generate 60 Gapja IDs
const stemsEn = ['gap', 'eul', 'byeong', 'jeong', 'mu', 'gi', 'gyeong', 'sin', 'im', 'gye'];
const branchesEn = ['ja', 'chuk', 'in', 'myo', 'jin', 'sa', 'o', 'mi', 'sin', 'yu', 'sul', 'hae'];

for (let i = 0; i < 60; i++) {
  const stem = stemsEn[i % 10];
  const branch = branchesEn[i % 12];
  blogIds.push(`${stem}-${branch}`);
}

// Generate XML Content
const generateSitemap = () => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add Static Routes
  staticRoutes.forEach((route) => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${route}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add Blog Routes
  blogIds.forEach((id) => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}/blog/${id}</loc>\n`;
    xml += `    <lastmod>${TODAY}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
};

// Write to public/sitemap.xml
const sitemapContent = generateSitemap();
const publicDir = path.join(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Ensure public directory exists (it should, but safety first)
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(sitemapPath, sitemapContent);
console.log(`✅ Sitemap generated at: ${sitemapPath}`);
console.log(`Total URLs: ${staticRoutes.length + blogIds.length}`);
