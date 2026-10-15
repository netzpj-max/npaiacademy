# NPAi Academy

Public course introduction and registration landing page, served from the root of main by GitHub Pages.

## Course catalog

The page includes the current public Academy catalog: CAD and BIM 4D / Web Viewer are open; Free Web Hosting and 13 other courses are Coming Soon. The static metadata snapshot is in courses.json. Coming Soon cards do not have lesson links or invented release dates. Protected lesson content is not included here.

## Promotion

offer.json defines one absolute 10-hour campaign window shared by all visitors. offer.js computes the current price: 990 THB during the window, 1,990 THB afterward. Refreshing or revisiting does not restart the campaign. Set the campaign window once when publishing an explicitly authorized offer; do not regenerate it on page load or an unrelated deployment.

academy-page.js synchronizes the hero, signup card, mobile bar, booking dialog and prepared Messenger message. Expiry while the dialog is open invalidates an old prepared message and shows the new amount. A config-load failure keeps registration disabled and asks the visitor to refresh or contact the instructor.

The original instructor-supplied PromptPay QR remains unchanged and is displayed during the 990-THB offer only. After expiry, regular-price registration directs the learner to the instructor for payment information for 1,990 THB. Slips paid before expiry are reviewed by the instructor using their actual payment time.

The original logo, portrait and payment QR are separate static assets so the browser can render page content before those images finish loading. Their bytes are unchanged.

## Registration and privacy

The form collects name, email, phone and a local slip preview, prepares a message for copying, and offers a link to https://m.me/netz. The learner must paste the message, attach the original slip and send it themselves. This page does not upload a slip, automatically send messages, verify bank payments, grant credits or enroll a learner.

Form data is not persisted in browser storage and is cleared on closing the dialog. The supplied logo, portrait, original QR image and QR download bytes are preserved. No example learner data is embedded in production.

## Files

- index.html: static page and public catalog cards; original visual assets referenced from assets/.
- academy-updates.css: catalog and countdown styles.
- academy-page.js: countdown and registration interactions.
- offer.js: pure campaign validation and time/price calculations.
- offer.json: campaign start/end and approved prices.
- courses.json: public catalog snapshot.

No Supabase authentication, payment webhook, provider secret or protected course content is deployed here. Real lesson access remains at https://app.npairender.com/academy/.
## Hero slideshow

The Hero uses the two instructor-supplied CAD and BIM screenshots. Lossless WebP assets retain the original dimensions and decoded pixel data. Images use contain sizing, with a full-image dialog for detail. hero-slideshow.js provides previous/next, direct selectors, keyboard arrows, pause/play, and a 7-second rotation. Automatic rotation is paused for reduced-motion preferences, hidden tabs, interactions and the expanded image. The first image remains visible without JavaScript. Offer pricing/deadline and registration modules are unchanged.
