# The Letterbox

A beautiful, nostalgic email client built with React that presents emails as physical letters with realistic animations and interactions.

## Features

- **Physical Letter Design**: Emails are displayed as elegant envelopes with postage stamps and wax seals
- **Smooth Animations**: Realistic fold and burn animations when archiving emails
- **Reply Functionality**: Write responses in a beautiful notebook-style interface
- **Stack Navigation**: Click envelopes to bring them to the front
- **Read Status**: Visual indicators show which letters have been read
- **Empty State**: Elegant message when all letters are answered

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LetterMail
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
LetterMail/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.test.jsx     # Test suite
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles
│   └── test/
│       └── setup.js     # Test configuration
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## Core Features Tested

The test suite ensures the following core features work correctly:

- ✅ Initial render with all emails displayed
- ✅ Opening emails and displaying content
- ✅ Marking emails as read when opened
- ✅ Stack navigation (bringing envelopes to front)
- ✅ Reply functionality
- ✅ Archive via Fold button
- ✅ Archive via Burn button
- ✅ Empty state display
- ✅ Email data display (sender, subject, date)

## Development

### Key Components

- **App**: Main application component managing email state
- **Envelope**: Individual email envelope/letter component
- **PostageStamp**: Visual stamp component with read status
- **WaxSeal**: Decorative seal component
- **RealisticFire**: Burn animation overlay

### Animation Details

- **Fold Animation**: 3D transform simulating paper folding
- **Burn Animation**: Mask-based animation with fire particles
- **Stack Animation**: Smooth transitions when reordering envelopes

## License

MIT

