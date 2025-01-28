# Your Next.js Project Structure

## Directory Structure

/your-nextjs-project
├── /app                     # Next.js App Directory (for Next.js 13+)
│   ├── /api                 # API routes
│   ├── /auth               # Authentication pages
│   │   ├── /login/page.js   # Login page
│   │   └── /signup/page.js  # Signup page
│   ├── layout.js           # Root layout
│   └── page.js             # Home page
├── /components             # Reusable UI components
│   ├── /common             # Shared components
│   ├── /features          # Feature-specific components
│   ├── /layout            # Layout components
│   └── /ui                # UI components (buttons, inputs, etc.)
├── /config                # Configuration files
│   └── site.ts           # Site-wide configuration
├── /hooks                 # Custom React hooks
├── /lib                   # Utility functions and service setup
│   └── supabase.ts       # Supabase client configuration
├── /public                # Static assets
│   ├── /images
│   └── /fonts
├── /styles                # Global styles
│   └── globals.css
├── /types                 # TypeScript type definitions
├── /utils                 # Helper functions
├── .env.local             # Environment variables
├── .gitignore
├── next.config.js         # Next.js configuration
├── package.json           # Project dependencies
├── README.md              # Project documentation
└── tsconfig.json         # TypeScript configuration
