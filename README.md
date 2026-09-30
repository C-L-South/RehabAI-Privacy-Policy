# RehabAI website

A static HTML/CSS website with app previews, a blog, privacy information, and an erasure request page. Brand accent: `#4503A0`.

## Preview

Run `python3 -m http.server 3000` from this directory and open http://localhost:3000. All pages work without JavaScript; the homepage video uses a YouTube embed. Deploy the entire directory to your static host, including `images/`.

## Blog

- `blog.html`: article index
- `what-is-rehabai.html`: introduction to RehabAI and its core functionality
- `first-release.html`: first-release notes dated September 20, 2026
- `connectivity-audio-update.html`: connectivity and audio update dated September 29, 2026

Posts carry publication dates and organization authorship. Release details are supplied by the app owner, and the articles avoid medical-outcome claims. For future release posts, verify the version, release date, available platforms, actual changes, and download URL before publishing. Add each post to both the blog index and the homepage, and keep its BlogPosting metadata consistent with the visible text.

## Search and answer-engine visibility

Pages have unique titles and descriptions, social-preview metadata, descriptive links, semantic headings, and readable HTML. Blog posts include BlogPosting JSON-LD. The homepage answers availability, update, and privacy questions directly. No tracking scripts were added.

Reviewed resources informing the approach:

- [Semrush Academy](https://www.semrush.com/academy/courses/?categories=seo): on-page metadata, content structure, and internal linking.
- [Neil Patel SEO Unlocked](https://neilpatel.com/training/seo-unlocked/): on-page SEO, content, and measurement curriculum.
- [Profound 101](https://university.tryprofound.com/courses/profound-101): retrieval, answer-oriented content, and citation measurement. Public course overview reviewed; this is not a claim of course completion or use of a paid tool.

The production URL is not configured in this repository. At inspection, the repository metadata reported GitHub Pages disabled and its default Pages URL returned 404. Once the live domain and hosting path are confirmed, add self-referencing absolute canonical URLs and `og:url` to all pages, absolute article URLs in JSON-LD, and a sitemap covering the seven pages. Add a sitemap directive to the host-root robots.txt if you control it; a project-subdirectory robots.txt does not control the host. Do not invent a production URL.

After deployment, verify all seven URLs return 200, submit the sitemap in Search Console, and record a baseline of impressions, clicks, and queries. Compare subsequent periods and review whether answer engines cite the relevant pages. Ranking or citation improvements are not guaranteed.

## Erasure requests

The erasure page opens the published Google Form. Submissions are recorded in the linked private Google Sheet. No email backend or API endpoint is required.

Public form: https://docs.google.com/forms/d/e/1FAIpQLSd09BfXPi4r62Hw7W1ixpeKceRaE68W3hglbVAxOFEl8-Qm9w/viewform

The owner can manage requests through Google Forms → Responses → View in Sheets. Keep the response spreadsheet restricted and do not enable response summaries for respondents. The website contains only the public responder URL, never an editor or spreadsheet link.

This is a manual review workflow; submitting the form does not erase account data. The owner reviews requests and responds using the supplied account email. Privacy-policy and erasure-page body content remains unchanged by the blog update.
