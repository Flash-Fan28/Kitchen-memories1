# Kitchen Echoes

A browser-based sensory memory board game about a family, a kitchen, and the everyday objects that preserve care.

## Play locally

Open `index.html` in any modern browser. No build step, package manager, or server is required.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this folder to the repository root.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. GitHub will display the public URL after deployment completes.

## Project structure

- `index.html` — interface and game screens
- `styles.css` — visual design and responsive layout
- `app.js` — board generation, clues, turns, guessing, endings, and restart logic
- `.nojekyll` — asks GitHub Pages to serve the site as plain static files

## Customising the story

Character settings, sensory clues, objects, times, locations, and final stories are all stored in the `characters` array at the top of `app.js`.

## License

This prototype is provided for the project owner's use and adaptation.
