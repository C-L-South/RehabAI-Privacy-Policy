# Homepage redesign handoff

## Design review and changes

The original homepage distorted two different screenshots into equal fixed-height frames, gave both images equal emphasis, had no primary hero action, and prioritized legal navigation, partner logos, and blog content above the core product. The library and progress screens were absent from the homepage.

The new design focuses on people exercising at home. One authentic session screen leads the hero; concise feature sections explain movement tracking, exercise discovery, setup guidance, and session history. A camera-view crop retains the original markers and feedback indicator and links to the full source screen. Library, guidance, and progress screens are shown in full at their natural aspect ratios. Mobile feature copy precedes each image.

The owner requested **Download the app** buttons in the hero and header (also mirrored in the mobile menu). The owner explicitly requested appearance only, with no download functionality. These are styled native disabled buttons; no download destination is implied. The functional secondary hero link, **See app features**, navigates to `#features`. The owner also removed the orientation strip, three-step How it works section, closing CTA panel, hero descriptor, and progress eyebrow. Links to the deleted section have been removed. The menu and FAQs use native `details` controls. JavaScript only adds menu dismissal and focus handling. Existing support, privacy, erasure, blog, and YouTube destinations remain accessible. A dedicated two-column partner section displays the supplied MIT App Inventor and Braze Social Impact logos. A responsive embedded YouTube app showcase and a dated App updates section restore those original homepage functions. No visitor camera access, tracking scripts, new legal text, or store badges were added.

## Reference principles

Reviewed October 3, 2026:

- [Flighty](https://flighty.com/): prominent product imagery and feature storytelling. Adapted as one dominant real session screen with brief annotations.
- [Structured](https://structured.app/): a short product explanation supported by interface previews. Adapted as a clear introduction and successive feature screens.
- [Planta](https://getplanta.com/): benefit-led app presentation and concise feature descriptions. Adapted to RehabAI's exercise-focused copy.
- [Opal](https://opalapp.com/): short feature headings paired with product visuals. Adapted without copying claims or branding.

Palette: violet `#4b08a8`, deep purple `#25084b`, lavender `#d9c5f5`, pale lavender `#eee5fa`, page `#fcfaff`, text `#191320`. System sans-serif typography keeps loading light. Tokens are centralized in `home.css`; all homepage selectors are scoped to avoid altering supporting pages. The gradient is confined to the hero stage.

## Available assets

Originals are preserved in `images/`. Optimized derivatives are in `images/optimized/`.

| Original | Dimensions | Use |
| --- | --- | --- |
| Store Listing Phone Assets (3).png | 734 × 1562 | Hero session, camera detail source |
| exercise-library.png | 736 × 1561 | Full exercise library screen |
| app-screen-2.png | 1080 × 1920 | Full Cobra Stretch setup screen |
| progress-tracking.png | 736 × 1561 | Full progress screen with example data |

The brief's `1.png`, `2.png`, `3.png`, and `5.png` are not in the repository. The actual replacements above are authentic framed screens, rather than promotional posters. No personalization questionnaire image is available, so that module remains pending rather than fabricating an interface or questionnaire. `app-screen-1.png` is retained but not used in this design.

## Owner confirmation before launch

- Actual store URLs and supported platforms. Replace all three disabled download buttons with anchors to the verified download URL and add official badges as appropriate.
- Release status. The repository contains owner-supplied release posts; the homepage makes no availability promise.
- Pricing, trial terms, supported devices, camera permissions, and installation requirements.
- Camera/video processing, storage, sharing, accuracy, and scoring criteria. The homepage describes visible UI only; existing privacy and article claims need owner review independently.
- Personalization behavior and original questionnaire screen before adding that section.
- Confirm the existing support address `support@rehab-ai.app`, supplied privacy document, erasure process, and YouTube video remain current. No terms document is present.
- Original RehabAI logo/favicon and clean screenshots if available. The website uses a text wordmark. No canonical or absolute social-image URL is configured until the production domain is known.
- Any clinical claims, endorsements, testimonials, download counts, or ratings require independent evidence before inclusion.

## Validation

This is a static site with no build, lint, or type-check scripts. `node --check home.js` validates the small enhancement script. Browser checks cover desktop, tablet, mobile and narrow mobile layouts, natural screenshot ratios, local links, keyboard menu/FAQ operation, Escape dismissal, skip link, reduced motion, no-JavaScript interaction, and missing-image layout. Performance targets in the brief remain targets; field Core Web Vitals have not been measured.

Final browser results: no horizontal overflow at 1440×900, 768×1024, 390×844, or 320×844. All local navigation destinations returned HTTP 200 and all section anchors exist. Menu/FAQ keyboard checks, Escape dismissal, no-JavaScript controls, and reduced-motion checks passed. Console and page error collections were empty. Image failure checks retain explanatory copy and reserved image space. Zoom was checked with 200% CSS scaling and a 720px reflow equivalent; native browser toolbar zoom was not exercised. Text/CTA palette contrast checks meet 4.5:1 for tested pairs; the hero caption uses deep purple to maintain contrast at the darkest lavender point.

## Maintaining app updates

The homepage `#updates` section contains dated cards for the September 29 connectivity/audio update and September 20 first release. Add future update cards at the top of `.update-grid` in `index.html`, with a publication date, a concise summary, and links to the corresponding release post. Also add the post to `blog.html` and keep its visible date and structured metadata consistent. No CMS or publishing backend has been added to this static site.

The video uses the original `Gl6iJwiuq00` YouTube destination, embedded without autoplay via `youtube-nocookie.com`. A visible YouTube link remains available if embedding is blocked. Playback, captions, and availability are controlled by YouTube and the original video owner.

Restored-section validation: partner and update sections visually inspected at desktop and mobile sizes; 1440, 768, 390, and 320px widths have no horizontal overflow. The supplied YouTube embed loaded its titled player and preview image in Chrome. Full video playback was not exercised. Update article links return HTTP 200.

Browser-comment revision: all seven marked changes applied. The owner confirmed download buttons are appearance only. Checked 1440, 964, 768, 390, and 320px widths: no horizontal overflow or broken section anchors. Partner credits, showcase video, and app updates remain. Mobile menu and FAQ keyboard controls still pass.

Latest browser-comment changes: removed the guidance asset’s transparent side margins (76px on each side), preserving the entire original phone/UI in 928×1920 PNG/WebP derivatives. Added all ten owner-confirmed exercises in the supplied order; removed the library’s extra closing sentence. Moved the example-data disclosure into the progress figure caption, replacing its former label. Originals remain intact.

## Condensed feature presentation

The latest owner request replaces the four full-width alternating feature sections with a two-column grid of four compact product cards. Each card summarizes the key behavior and retains its original feature image. The session screen remains in the hero. All feature visuals now have full-size image links. The owner-confirmed ten-exercise list remains in a native keyboard-accessible disclosure to keep the main summary concise. The header wordmark increases from 30px to 44px on desktop and from 28px to 36px on mobile.

Measured feature-area height at 1440px width fell from 3516px to 1338px (about 62%); at 390px width it fell from 4844px to 3299px (about 32%). Browser layouts inspected at 1864, 1440, 964, 768, 390, and 320px widths have no horizontal overflow. Four feature images remain, all retain their natural proportions, all full-image destinations return HTTP 200, and all section links resolve. Exercise disclosure and mobile menu keyboard controls pass; no page-script errors were recorded.

Latest owner comments: movement card now shows the complete squat session rather than a camera crop. Feature screenshots increase from 220px to 280px on desktop, with narrower copy columns and slightly smaller headings. The hero phone shifts 20px right where annotations are visible, with adjusted annotation spacing. Footer Blog link removed; all HTML contact destinations and visible email addresses now use the owner-supplied `support@rehab-ai.app`.

After the image enlargement, responsive checks at 1864, 1440, 1280, 1101, 964, 768, 720, 390, and 320px show no horizontal overflow or hero annotation overlap. Decorative annotations are hidden when the split hero has insufficient room. All seven HTML pages were checked for contact destinations; each mailto link uses the supplied support address. The earlier feature-height measurements describe the preceding smaller-image version.

Owner confirmed the movement copy now describing joint tracking, repetition counting, real-time feedback, and score indicators. The movement image uses an optimized derivative of app-screen-1.png with only its transparent 76px side margins removed, bringing its visible screen width in line with the other feature images. The original remains available through its full-image link. Partner credits now appear between the hero and feature grid.

## MIT App Inventor visual credits

The owner requested a visual treatment within the existing platform-credit section rather than a separate explanatory story. All three block images now sit beneath the MIT App Inventor logo on a lavender stage, with the Braze partnership credit alongside it. On mobile the credits stack, and the blocks use a compact two-column arrangement. Removed the separate story, explanations, tabs, and tab scripting. The MIT logo links to the platform; each block image links to its original full-size PNG.

Validated at 1440, 768, 390, and 320px: all three blocks visible, no horizontal overflow, no script errors, and all full-size image links return HTTP 200. Inspected desktop and mobile section screenshots.


## Platform-credit layout redesign

Design plan: retain the established violet #4b08a8, lavender #eee5fa, page #fcfaff, ink #191320, and border #e6deef. Keep the existing sans-serif and quiet 17px credit labels. Use two equally weighted, centered platform credits above a broad block-editor canvas; the authentic blocks are the memorable visual.

    MIT App Inventor     |     Braze Social Impact
    [audio blocks]   [exercise blocks]   [timer blocks]

Review against the brief: replace the previous oversized MIT card and isolated Braze column with a shared credit row. Avoid adding feature captions or explaining code. A restrained workspace dot pattern and staggered image positions relate directly to the block editor; no extra badges, arrows, or motion. Preserve every image in full, with a compact two-column mobile composition and full-size image links.

Redesign implemented: equal platform credits on a shared row, above a broad lavender block-editor canvas. All three images are larger than in the prior MIT-only card and offset slightly to accommodate their different proportions. The dot pattern is confined to the workspace. Mobile keeps both credits on one row and arranges audio above the other two block images. Screenshot review confirmed full images without clipping. Checks at 1440, 768, 390, and 320px report no overflow, three visible block images, successful full-size image links, and no script errors.

Latest owner refinement: blocks now form one compact cluster (audio and selection stacked on the left, timer nestled alongside), paired with the statement “Built entirely in MIT App Inventor.” This product-build statement comes directly from the owner. The shared MIT/Braze credit row remains above. Desktop uses a copy/image split; mobile puts copy before the complete cluster. Verified all three images and full-size links, no script errors, and no overflow at 1440, 768, 390, and 320px. Reviewed desktop/mobile screenshots.

Latest decoration cleanup: removed the hero's orbit element and both circle CSS rules. Removed the lavender fill and dot pattern behind the block cluster; it now sits directly on the page background. Kept image sizes, arrangement, and spacing intact. Responsive checks at 1440, 768, 390, and 320px still show all three images without overflow or page-script errors.

Latest owner layout change removes the separate platform-credit row. The MIT App Inventor logo now replaces the platform name in the “Built entirely in” heading and remains linked to the platform. Braze Social Impact appears under the supporting copy on the left, labeled “Sponsored by” as supplied by the owner. Block cluster remains on the right, stacking below on mobile. Desktop/mobile screenshots reviewed; responsive checks at 1440, 768, 390, and 320px show all blocks, working full-size image destinations, no overflow, and no script errors.

Latest browser refinements: Braze sponsorship is now a separate narrow, horizontally centered strip between the build story and features. Removed the movement card’s About RehabAI link. Exercise library now shows Bodyweight Squat, Forward Lunge, and Side Bend immediately; a native View more/View less disclosure holds the remaining seven owner-confirmed exercises. Checked 1440, 768, 390, and 320px layouts without overflow. Keyboard Enter opens and closes the disclosure with the expected label and seven additional visible names; no script errors recorded. Reviewed sponsorship and library screenshots.

Latest owner refinements: narrowed the build story’s left column to roughly 28% on desktop, reduced the title to 26–30px, and enlarged the block cluster. Supporting copy now reads “RehabAI was developed entirely inside the MIT App Inventor platform using only block code,” as requested by the owner. Added a typographic Youth Incubator Program credit next to Braze in the narrow sponsorship strip, linking to https://www.appinventor.org/youth-incubator-program; no invented logo. Checked the official page for the program’s name and Foundation attribution. The strip wraps responsively. Desktop and 320px sponsorship screenshots reviewed; checks at 1440, 768, 390, and 320px report no overflow or script errors and all blocks remain visible. Existing exercise disclosure keyboard checks still pass.


## Recognition section and hero cleanup

Replaced the video section heading with “As seen on” and a responsive two-column composition: Congressional App Challenge recognition with two credited event photos alongside the existing MIT App Inventor showcase video. The official winner announcement confirms Cody Li / RehabAI as the 2024 winner for Texas’ 24th District (https://www.congressionalappchallenge.us/24-tx24/). Photos come from the owner-linked Rep. Beth Van Duyne Instagram post (https://www.instagram.com/p/DIcYHDDSQEs/); originals are preserved in images/recognition, with separate WebP derivatives. Full-photo links and source attribution are visible.

Removed the FAQ section and its navigation links, and removed the hero secondary feature link. Hero stage is white; floating annotations use the existing pale lavender token. Browser checks at 1440, 768, 390, and 320px show no horizontal overflow, loaded local photos, valid local anchors, and the requested removals. Desktop screenshot confirms the YouTube player renders; no browser warning/error logs recorded.


Latest refinement: renamed “As seen on” to “Recognition & presentations” to reflect the district award and actual presentation content. Added the owner-supplied MIT talk above the original showcase, using youtube-nocookie.com/embed/5WQgLboa_I8?start=588 and a matching 9:48 external link. Two videos stack in the right column; all stories stack on mobile. Hero stage background is now fully transparent. The existing purple annotation cards remain. Browser confirmed both embeds render; playback of the new presentation began around the requested timestamp (currentTime 597.6 after the elapsed preview time). Mobile 390px has one column and no horizontal overflow; desktop also has no overflow. Preview playback stopped and viewport override reset.


Recognition layout design refinement: retain the existing violet #4b08a8, dark violet #25084b, page #fcfaff, white #ffffff and muted #62586e, with the existing sans serif. Use a compact centered award story (left-aligned 350px copy beside two complete, subtly staggered photos), followed by two equally sized video players on a shared baseline. The photographs provide the distinctive composition; avoid extra tinted cards, labels and decorative motion. Reviewed the prior two-column layout: its stacked videos left a large blank area below the award. Revised into an award row and an aligned video row, preserving both photos, both videos and source links.

Validated desktop and tablet player alignment and responsive single-column videos at 390px and 320px, without horizontal overflow. Both embedded players render, and the MIT presentation still uses start=588. No new dependencies or scripting added.


Recognition polish: heading shortened to “Recognition.” Announcement link now appears as a neutral outlined button; photo credits and video fallback links use muted text rather than purple. Captured a clean, authentic speaker frame from the owner-linked MIT presentation as images/recognition/mit-presentation.png. The preview links to YouTube from 9:48 without JavaScript; with JavaScript, standard activation replaces it with the embedded player using start=588 and autoplay=1. Modified clicks retain normal link behavior. Preview is keyboard accessible and player receives focus. Original showcase embed remains unchanged. Node syntax check passed, poster loaded in browser, and Enter activation created the expected timestamped iframe.


Latest recognition refinements: restored brand-purple text on the announcement button, photo attribution and YouTube links, retaining the outlined announcement format. Added a top divider and 48px heading spacing. Playback and fallback links now begin at 591 seconds (9:51), with matching visible and accessible labels. Captured a new authentic 9:51 frame from the MIT presentation and cropped the player chrome outside the speaker area; saved separately as images/recognition/mit-presentation-951.png. The temporary capture page was removed. JavaScript syntax check passed.
