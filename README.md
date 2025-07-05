# NotebookLM Directory

A curated directory of innovative NotebookLM projects across various domains. Discover AI-powered research applications, share your own projects, and get inspired by the community.

## Features

- 📚 Browse curated NotebookLM projects by category
- 🔍 Search and filter projects
- ➕ Submit your own NotebookLM projects
- 🎯 Featured project highlights
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 13, React 18
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS-in-JS (inline styles)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+ 
- A Supabase account and project

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd notebooklm-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Apply database migration**
   
   ⚠️ **IMPORTANT**: Before running the app, you must apply the database migration:
   
   - Go to your [Supabase Dashboard](https://supabase.com)
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20250705054804_precious_pond.sql`
   - Execute the query to create the `notebooks` table and sample data

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/notebooklm-directory)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy!

3. **Apply Database Migration**
   
   If you haven't already, apply the migration to your Supabase database:
   - Open Supabase Dashboard → SQL Editor
   - Execute `supabase/migrations/20250705054804_precious_pond.sql`

## Project Structure

```
├── components/           # React components
│   ├── Layout.js        # Main layout wrapper
│   ├── ProjectCard.js   # Project display card
│   └── NotebookModal.js # Modal for adding notebooks
├── lib/                 # Utility libraries
│   ├── supabase.js     # Supabase client
│   └── notebooks.js    # Database operations
├── pages/              # Next.js pages
│   ├── index.js        # Homepage
│   ├── browse.js       # Browse projects
│   ├── submit.js       # Submit project form
│   └── about.js        # About page
├── supabase/
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

## Database Schema

The application uses a single `notebooks` table with the following structure:

- `id` (uuid, primary key)
- `title` (text, required)
- `description` (text, required) 
- `category` (text, required) - One of: Academic, Business, Creative, Research, Education, Personal
- `tags` (text array)
- `author` (text, required)
- `institution` (text, optional)
- `notebook_url` (text, required)
- `audio_overview_url` (text, optional)
- `featured` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues:

1. Check that your database migration has been applied
2. Verify your environment variables are correct
3. Ensure your Supabase project is active
4. Open an issue on GitHub for additional help