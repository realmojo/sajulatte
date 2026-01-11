const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const fs = require('fs');
const prettier = require('prettier');

const generateSitemap = async () => {
  // Define your routes here
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/daily', changefreq: 'daily', priority: 0.8 },
    { url: '/compatibility', changefreq: 'weekly', priority: 0.8 },
    { url: '/compatibility/analysis', changefreq: 'weekly', priority: 0.7 },
    { url: '/settings', changefreq: 'weekly', priority: 0.5 },
    { url: '/preferences', changefreq: 'monthly', priority: 0.3 },
    { url: '/privacy', changefreq: 'monthly', priority: 0.3 },
    { url: '/terms', changefreq: 'monthly', priority: 0.3 },
    { url: '/pillarscalendar', changefreq: 'weekly', priority: 0.7 },
    { url: '/encyclopedia', changefreq: 'weekly', priority: 0.7 },
    { url: '/amulet', changefreq: 'weekly', priority: 0.6 },
    // Add more static routes as needed
  ];

  const stream = new SitemapStream({ hostname: 'https://sajulatte.com' });

  const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  );

  const formattedXml = await prettier.format(xmlString, { parser: 'html' });

  fs.writeFileSync('./public/sitemap.xml', formattedXml);
  console.log('Sitemap generated successfully at ./public/sitemap.xml');
};

generateSitemap();
