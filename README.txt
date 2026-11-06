MAXIMALIST - OFFLINE EDITION

Unzip the complete folder, then double-click index.html. No server, Python installation, or build step is needed. Keep all assets beside the HTML file.

Gallery browsing, filters, animated cables, artwork windows, countdown, confetti, About & credits, and submission draft export work offline. Browser-local draft saving depends on your browser allowing storage for local files.

EXTERNAL LINKS
Cycling 74 and remote .maxpat downloads require internet. Opening a patch in Max requires an installed copy of Max and browser permission. The website cannot launch an application that is not installed. Most artworks are clearly labeled placeholders; their patch files and artist credits are not yet supplied.

RSVP / EVENT
The countdown targets December 3, 2026 (Pacific time), tentatively. It counts to the date, not a confirmed party time. RSVP links to the local event information section until a real RSVP URL is supplied. Edit dist-equivalent launch.js in this folder to update event settings.

EDITING
app.js: projects, category tags, artwork details and cable routing.
style.css: core styles. object-skin.css: Max-inspired box styling.
launch.js: countdown and celebration behavior.
showcase.js / showcase.css: the rotating homepage showcase (toggle, metro, urn, p showcase). Change INTERVAL in showcase.js to set the speed. It follows the gallery filter, holds the gallery's works count on wide screens, and frames vertical or square pieces whole (WIDE_ENOUGH sets the cutoff) so the window never changes size. Remove both files' tags from index.html to take it off.
credits.html: team / CADRE / SJSU information.
submit.html: the How to submit guide (what to send, description examples, rules, review steps).

ADDING A WORK (app.js)
Each work can have: title, artist, semester ('Fall 2026'), categories, description,
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
