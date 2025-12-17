# The Letterbox

A beautiful, nostalgic email client built with React that presents emails as physical letters with realistic animations and interactions.

## 🌐 Live Demo

**Visit the app:** [https://meetr1912.github.io/LetterMail/](https://meetr1912.github.io/LetterMail/)

> **Note:** If the link doesn't work yet, enable GitHub Pages in repository settings: [Settings → Pages → Source: GitHub Actions](https://github.com/meetr1912/LetterMail/settings/pages)

## Features

- **Physical Letter Design**: Emails are displayed as elegant envelopes with postage stamps and wax seals
- **Gmail Integration**: Connect your Gmail account to display real emails (optional)
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
git clone https://github.com/meetr1912/LetterMail.git
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

### Gmail Integration (Optional)

To connect your Gmail account and display real emails:

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Gmail API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Copy your Client ID

4. **Configure Environment Variable**:
   - Create a `.env` file in the project root:
     ```
     VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
     ```
   - Replace `your-client-id-here` with your actual Client ID

5. **Restart Development Server**:
   ```bash
   npm run dev
   ```

6. **Connect Gmail**:
   - Click "Connect Gmail" button in the app
   - Sign in with your Google account
   - Grant read-only access to your Gmail inbox
   - Your real emails will now be displayed!

**Note**: The app requests read-only access to your Gmail inbox. Your credentials are never stored, and all authentication is handled securely through Google's OAuth 2.0.

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
│   ├── App.jsx              # Main application component
│   ├── App.test.jsx         # Test suite
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global styles
│   ├── components/
│   │   └── GmailAuth.jsx    # Gmail authentication component
│   ├── services/
│   │   └── gmailService.js  # Gmail API service
│   └── test/
│       └── setup.js         # Test configuration
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables (create this)
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
- **GmailAuth**: Gmail OAuth authentication component
- **gmailService**: Service for Gmail API integration
- **PostageStamp**: Visual stamp component with read status
- **WaxSeal**: Decorative seal component
- **RealisticFire**: Burn animation overlay

### Animation Details

- **Fold Animation**: 3D transform simulating paper folding
- **Burn Animation**: Mask-based animation with fire particles
- **Stack Animation**: Smooth transitions when reordering envelopes

## License

MIT

