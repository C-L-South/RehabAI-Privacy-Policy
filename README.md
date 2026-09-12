# RehabAI

Three static pages: app placeholders, privacy policy, and erasure request page. The brand accent is #4503A0.

## Erasure requests

The erasure page opens the published Google Form. Submissions are automatically recorded in the linked private Google Sheet. No Resend credentials, email backend, or API endpoint are required.

Public form: https://docs.google.com/forms/d/e/1FAIpQLSd09BfXPi4r62Hw7W1ixpeKceRaE68W3hglbVAxOFEl8-Qm9w/viewform

The owner can manage requests through Google Forms → Responses → View in Sheets. Keep the response spreadsheet restricted and do not enable response summaries for respondents. The website contains only the public responder URL, never an editor or spreadsheet link.

This is a manual review workflow; submitting the form does not erase account data. The owner reviews requests and responds using the supplied account email.

## Publish or preview

Serve index.html, privacy.html, erasure.html, and styles.css from any static host, including GitHub Pages. For a local preview, run `python3 -m http.server 3000` from this directory, then visit http://localhost:3000.

The QR code and app image are clearly labeled placeholders in index.html. The original privacy-policy content remains at privacy.html.
