# RehabAI

Three responsive pages: app placeholders, the existing privacy policy, and an erasure request form. Shared accent: `#4503A0`.

## Run

Requires Node.js 22 or later. No package dependencies.

1. Copy `.env.example` to `.env`.
2. Set `RESEND_API_KEY` and `MAIL_FROM` using your Resend account and a verified sending domain. Keep these values server-side; never commit `.env`.
3. Keep `NOTIFICATION_EMAIL=codyli9219@gmail.com` or set your desired recipient.
4. Set `PUBLIC_ORIGIN` to the exact website origin (scheme and hostname, no trailing slash). Local default: `http://localhost:3000`.
5. Run `npm start` and visit `http://localhost:3000`.

Run `npm test` for validation, email integration (mocked), failure handling, static-file isolation, and rate limiting checks. No real emails are sent by tests.

## Deployment

Run this Node service on a host that supports long-running Node processes behind HTTPS. Serve the pages and `/api/erasure` from the same origin. Configure the environment variables on that host. GitHub Pages alone cannot execute this backend; deploying only the HTML will leave online submission unavailable, with email contact shown as an alternative.

The server sends a plain-text request through the Resend API: https://resend.com/docs/api-reference/emails/send-email. A successful response means the provider accepted the notification; it does not guarantee inbox delivery or erase account data. Monitor delivery in Resend and process requests manually. Account holders can also send a request directly to the privacy email.

The backend validates input, caps request size, checks Origin, includes a honeypot, and rate limits by socket address. No form data is written to application logs or a local database. Request data will exist in the email provider and recipient mailbox. Configure access and retention appropriately. The existing privacy policy text is preserved; review its description of request-related collection before launch.

Rate limits are in memory and reset on restart. Behind a reverse proxy the socket address may be shared; configure per-client rate limiting at the edge for production. Do not blindly trust client-supplied forwarding headers.

Replace the clearly labeled QR and app image placeholders in `index.html` when assets are available. Navigation uses relative URLs. The original policy is now `privacy.html`.
