# RehabAI website

A static HTML/CSS website with app previews, a blog, privacy information, and an erasure request page. Brand accent: `#4503A0`.

## Preview

Run `python3 -m http.server 3000` from this directory and open http://localhost:3000. All pages work without JavaScript. The homepage uses a native mobile menu; `home.js` adds menu dismissal, a responsive feature tour, and a scroll-progress timeline. The homepage includes the existing YouTube app showcase in a responsive embed with a fallback link, dedicated MIT App Inventor/Braze credits, and the founder’s story timeline. Deploy the entire directory to your static host, including `images/`.

## Blog

- `blog.html`: article index
- `password-guidance-update.html`: password controls and clarity update dated October 4, 2026
- `what-is-rehabai.html`: introduction to RehabAI and its core functionality
- `first-release.html`: first-release notes dated September 20, 2026
- `connectivity-audio-update.html`: connectivity and audio update dated September 29, 2026

Posts carry publication dates and organization authorship. Release details are supplied by the app owner, and the articles avoid medical-outcome claims. For future release posts, verify the version, release date, available platforms, actual changes, and download URL before publishing. Add each post to the blog index and search generator, and keep its BlogPosting metadata consistent with the visible text.

## Search and answer-engine visibility

Pages have unique titles and descriptions, social-preview metadata, descriptive links, semantic headings, and readable HTML. Blog posts include BlogPosting JSON-LD. The homepage explains observable exercise features and links to the existing privacy information and blog. No tracking scripts were added.

Production URL: **https://rehab-ai.app/**. Each HTML page has an absolute canonical URL and social preview URL. The homepage includes linked WebSite, Organization, Person, and MobileApplication entities; articles retain their visible dates and authors. Structured data describes existing features without invented ratings, prices, or medical outcomes.

Run `python3 scripts/configure_search.py` after editing page search descriptions. To change the verified production domain, run `python3 scripts/configure_search.py --site-url https://your-production-domain/`. The generator updates head metadata, `robots.txt`, and `sitemap.xml` without changing visible page content. The sitemap includes the seven currently linked pages; the older introduction article remains available but is omitted from the sitemap.

Deploy these files at the domain root. `robots.txt` allows public crawling, explicitly includes OAI-SearchBot, and points to the sitemap. Crawl permissions do not override a hosting firewall or guarantee inclusion.

After deployment:

1. Verify page, asset, robots, and sitemap URLs return 200 without login or crawler challenges.
2. Verify domain ownership in Google Search Console and submit `https://rehab-ai.app/sitemap.xml`.
3. Use URL Inspection for the homepage and review indexing reports, impressions, clicks, and queries over time.
4. Keep new app releases and product information accurate; update the generator when adding public pages.

Google’s [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) uses standard SEO fundamentals and does not require special AI files or schema. OpenAI documents [OAI-SearchBot](https://developers.openai.com/api/docs/bots) separately from its training crawler. No tracking scripts were added. Rankings and AI citations are not guaranteed.

## Erasure requests

The erasure page opens the published Google Form. Submissions are recorded in the linked private Google Sheet. No email backend or API endpoint is required.

Public form: https://docs.google.com/forms/d/e/1FAIpQLSd09BfXPi4r62Hw7W1ixpeKceRaE68W3hglbVAxOFEl8-Qm9w/viewform

The owner can manage requests through Google Forms → Responses → View in Sheets. Keep the response spreadsheet restricted and do not enable response summaries for respondents. The website contains only the public responder URL, never an editor or spreadsheet link.

This is a manual review workflow; submitting the form does not erase account data. The owner reviews requests and responds using the supplied account email. Privacy-policy and erasure-page body content remains unchanged by the blog update.

## Homepage design

See [DESIGN-HANDOFF.md](DESIGN-HANDOFF.md) for the design audit, reference principles, asset inventory, validation, and pending owner confirmations. Homepage styling is scoped in `home.css`; supporting pages continue using `styles.css`. Store URLs are unconfirmed. Per the owner’s latest design request, the header, hero, and mobile menu show disabled “Download the app” buttons as an appearance-only design requested by the owner. “See app features” remains the working feature-tour link.
