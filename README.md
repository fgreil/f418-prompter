# f418-prompter
A simple React-Native app for browsing data from a local SQLite-DB.

## Project structure
```
f418-prompter/
├── assets/
│   ├── icon.png              # App icon (1024x1024)
│   ├── splash.png            # Splash screen image
│   ├── adaptive-icon.png     # Android adaptive icon
│   └── favicon.png           # Web favicon
├── components/
│   └── CustomDrawer.js       # Right-side drawer with SVG and text
├── screens/
│   ├── ExploreScreen.js      # Main screen with markdown carousel
│   ├── FavoritesScreen.js    # Favorites placeholder screen
│   ├── HistoryScreen.js      # History placeholder screen
│   └── SearchScreen.js       # Search placeholder screen
├── .gitignore                # Git ignore file
├── app.json                  # Expo configuration
├── App.js                    # Main app component with navigation
├── babel.config.js           # Babel transpiler configuration
├── database.js               # SQLite database setup and operations
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locked dependency versions (will be generated)
└── styles.js                 # Central style configuration
```

## Features
- Purple top bar (RGB 128, 0, 128) with white text
- Hamburger menu (left) opens drawer from right
- Search icon (right) navigates to Search screen which has a back arrow.
- Three main screens and bottom tab navigation with Material icons (public, heart, history)
- Carousel on Explore screen with left/right swipe
- Markdown rendering (headings, bold, italic, links, bullets, numbered lists)
- SQLite database with three content entries
- Custom drawer screen with SVG graphics which dismisses on tap

## Howto
1. Run `npm install` to create the folder `node_modules/` and the file `package-lock.json`
2. Run `npm start` to launch the app
3. To run on specific platform, try `npm run android`
