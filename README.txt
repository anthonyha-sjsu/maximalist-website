MAXIMALIST - OFFLINE EDITION

Unzip the complete folder, then double-click index.html. No server, Python installation, or build step is needed. Keep all assets beside the HTML file.

Gallery browsing, filters, animated cables, artwork windows, countdown, confetti, About & credits, and submission draft export work offline. Browser-local draft saving depends on your browser allowing storage for local files.

EXTERNAL LINKS
Cycling 74 and remote .maxpat downloads require internet. Opening a patch in Max requires an installed copy of Max and browser permission. The website cannot launch an application that is not installed. Most artworks are clearly labeled placeholders; their patch files and artist credits are not yet supplied.

RSVP / EVENT
The countdown targets December 11, 2026 (Pacific time), tentatively. It counts to the date, not a confirmed party time. RSVP links to the local event information section until a real RSVP URL is supplied. Edit dist-equivalent launch.js in this folder to update event settings.

EDITING
app.js: projects, category tags, artwork details and cable routing.
style.css: core styles. object-skin.css: Max-inspired box styling.
launch.js: countdown and celebration behavior.
showcase.js / showcase.css: the homepage showcase (toggle, number box -> metro, urn). It opens on the Patch of the Week (PATCH_OF_THE_WEEK in app.js), then urn picks other works at random, bringing the Patch of the Week back every 5 picks (EVERY in showcase.js) with its label lit up. The rotation follows the gallery filter.
credits.html: team / CADRE / SJSU information.
submit.html: the Submit a patch page: the guide (what to send, examples, rules, review steps) with the form right below it (submit-form.js).

ADDING A WORK (app.js)
Each work can have: title, artist, categories, description, statement (artist statement),
portfolioUrl, coverUrl + imageAspect, patchPreview (patching screenshot), patchFileUrl,
previewVideo (MP4) + previewPoster, or previewAudio (MP3), and previewNote.
The Preview section and Portfolio link only show up when those fields are filled in.
assets/signal-bloom-preview.mp4 and assets/room-tone-preview.mp3 are labeled samples. Delete them once real previews come in.
fonts/: bundled IBM Plex Mono fonts and their SIL Open Font License.

Submissions are local drafts; there is no upload service or backend.


EXTRAS
theme.js + dark.css: dark mode. The moon / sun button in the footer switches it; the choice is saved per browser.
Dark mode and images: placeholder art is color-flipped in dark mode. Real student images are never flipped. If a work has coverUrlDark / patchPreviewDark (a screenshot taken with Max in a dark theme), dark mode shows that one instead. See Metro 01 for an example.
Keyboard: in an artwork window, left / right arrows flip through works (Esc closes). Elsewhere, ? lists shortcuts and B bangs the showcase.
Opening a work: the clicked card (or the showcase) grows into the artwork window, and shrinks back into it on close. Uses the browser's view transitions; older browsers just open the window.
Patching screenshots zoom: double-click, pinch, or the - / + / fit buttons; drag to look around.
transitions.js: pages fade between each other while the header stays still.
launch.js: the countdown digits roll like an odometer.

Filter: the "filter" menu object above the gallery. Its colored outlets send the cables to the first row of cards, and the cables take the active filter's color.
Category colors: --c-sound, --c-visual, --c-interactive, --c-3d, --c-other at the bottom of style.css (dark versions in dark.css).
Gallery / List switch: at the bottom of the filter menu (Layout). The choice is remembered per browser.
submit-form.js: the submission form. Files are picked from the visitor's computer (click or drag and drop) and previewed with a live card whose glow comes from the tags. Nothing is uploaded yet; once there's a server, send the FormData from collect() in the submit handler.
"What is Max?": the button under the title on the homepage opens a short explanation for visitors who don't know Max (in index.html, class what-is-max).
Filter menu cord: inside the open filter menu, a cord comes in at the top left and runs down a rail into the current category's inlet. Drag its square plug to another category to filter (code at the end of the filter section in app.js).
