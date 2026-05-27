# Setting Up the Agora Client Project

Due to PowerShell environment limitations on this system, the project structure setup needs to be completed manually. Below are all the files and directories needed, along with their content.

## Quick Setup Instructions

### Option 1: Automatic (Recommended - if Node.js is available)

Run these commands in the Agora-V2 directory:

```bash
node quick-setup.js
node setup-structure.js
```

### Option 2: Manual Setup

Follow these steps to create the React frontend structure:

## Directory Structure to Create

```
client/
├── public/
│   └── .gitkeep
├── src/
│   ├── components/
│   │   └── .gitkeep
│   ├── pages/
│   │   └── .gitkeep
│   ├── hooks/
│   │   └── .gitkeep
│   ├── stores/
│   │   └── .gitkeep
│   ├── services/
│   │   └── .gitkeep
│   ├── utils/
│   │   └── .gitkeep
│   ├── types/
│   │   └── .gitkeep
│   ├── styles/
│   │   ├── .gitkeep
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Files Content

All file contents are provided below. You can copy and paste them into the respective files.

### 1. Create the `client` directory structure

```
mkdir client
mkdir client\src
mkdir client\src\components
mkdir client\src\pages
mkdir client\src\hooks
mkdir client\src\stores
mkdir client\src\services
mkdir client\src\utils
mkdir client\src\types
mkdir client\src\styles
mkdir client\public
```

### 2. Create Empty Marker Files

```
type nul > client\src\components\.gitkeep
type nul > client\src\pages\.gitkeep
type nul > client\src\hooks\.gitkeep
type nul > client\src\stores\.gitkeep
type nul > client\src\services\.gitkeep
type nul > client\src\utils\.gitkeep
type nul > client\src\types\.gitkeep
type nul > client\src\styles\.gitkeep
type nul > client\public\.gitkeep
```

### 3. Configuration and Source Files

See the individual files in the `client-setup-files/` directory or refer to the setup scripts:
- `quick-setup.js` - Creates directories
- `setup-structure.js` - Creates all files with proper content

## Next Steps After Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Technologies Included

- **React** 18.2 - UI library
- **Vite** 5.0 - Build tool & dev server
- **Tailwind CSS** 3.3 - Utility-first CSS framework
- **React Router** v6 - Client-side routing
- **Zustand** 4.4 - State management
- **Axios** 1.6 - HTTP client
- **Socket.io-client** 4.7 - Real-time communication

## Configuration Details

### Vite Dev Server
- Runs on `http://localhost:3000`
- Proxies `/api/*` requests to `https://localhost:3001` (backend)

### Tailwind CSS
- Mobile-first approach
- Configured for all src files
- PostCSS auto-prefixing enabled

### Environment Variables
Copy `.env.example` to `.env.local` and customize:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_SOCKET_URL` - WebSocket server URL

## File Contents

The setup scripts contain all the necessary file contents. If you need to create files manually, see the setup-structure.js file which contains all the content as strings.
