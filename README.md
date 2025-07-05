# NotebookLM Directory

A curated directory of innovative NotebookLM projects across various domains. Discover AI-powered research applications, share your own projects, and get inspired by the community.

🎉 **MVP Complete** - Ready for production deployment!

## Features

- 🔐 **User Authentication** - Sign up, sign in, profile management
- 📚 **Browse Projects** - Curated NotebookLM projects by category
- 🔍 **Search & Filter** - Find projects by keywords and categories
- ➕ **Submit Projects** - Share your own NotebookLM projects
- 💾 **Save Notebooks** - Bookmark interesting projects
- 👤 **User Profiles** - Personal dashboards and project management
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔒 **Row Level Security** - Secure data access with Supabase RLS

## Tech Stack

- **Frontend**: Next.js 13, React 18
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
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
   
   ⚠️ **CRITICAL**: Apply ALL migrations in order:
   
   - Go to your [Supabase Dashboard](https://supabase.com)
   - Navigate to SQL Editor
   - Execute these migrations in order:
     1. `supabase/migrations/20250705070830_jade_poetry.sql`
     2. `supabase/migrations/20250705072047_crimson_hall.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Complete Flow

1. **Sign up** for a new account
2. **Submit a notebook** using the form
3. **Save/unsave** notebooks from other users
4. **View your profile** and personal dashboards
5. **Browse and search** the directory

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
   - Configure environment variables (see `.env.example`)
   - Deploy!

3. **Verify Database Migrations**
   
   Ensure all migrations are applied in your Supabase project

4. **Test Production Deployment**
   
   - Create test account
   - Submit test notebook
   - Verify all features work

## Project Structure

```
├── components/           # React components
│   ├── Layout.js        # Main layout wrapper
│   ├── ProjectCard.js   # Project display card
│   ├── NotebookModal.js # Modal for adding notebooks
│   ├── AuthModal.js     # Authentication modal
│   └── UserMenu.js      # User dropdown menu
├── lib/                 # Utility libraries
│   ├── supabase.js     # Supabase client
│   ├── notebooks.js    # Notebook operations
│   ├── auth.js         # Authentication functions
│   └── profiles.js     # User profile operations
├── pages/              # Next.js pages
│   ├── index.js        # Homepage
│   ├── browse.js       # Browse projects
│   ├── submit.js       # Submit project form
│   ├── about.js        # About page
│   ├── profile.js      # User profile page
│   ├── my-notebooks.js # User's submitted notebooks
│   └── saved.js        # User's saved notebooks
├── supabase/
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

## Database Schema

The application uses these main tables:

### `notebooks`

- `id` (uuid, primary key)
- `title` (text, required)
- `description` (text, required) 
- `category` (text, required) - One of: Academic, Business, Creative, Research, Education, Personal
- `tags` (text array)
- `author` (text, required)
- `user_id` (uuid, foreign key to auth.users)
- `institution` (text, optional)
- `notebook_url` (text, required)
- `audio_overview_url` (text, optional)
- `featured` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `profiles`

- `id` (uuid, primary key, references auth.users)
- `full_name` (text)
- `bio` (text)
- `institution` (text)
- `website` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `saved_notebooks`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `notebook_id` (uuid, foreign key to notebooks)
- `created_at` (timestamp)

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Authentication required** for submissions and saves
- **User data isolation** - users can only access their own data
- **Public read access** for browsing notebooks
- **Secure environment variables** for API keys

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## 🎯 MVP Features Complete

✅ **User Authentication & Profiles**  
✅ **Notebook Submission & Management**  
✅ **Save/Bookmark Functionality**  
✅ **Browse & Search Notebooks**  
✅ **Responsive Design**  
✅ **Row Level Security**  
✅ **Personal Dashboards**  
✅ **Production Ready**  

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues:

1. Check that all database migrations have been applied
2. Verify your environment variables are correct
3. Ensure your Supabase project is active
4. Test authentication flow end-to-end
5. Open an issue on GitHub for additional help

---

## 🚀 Ready for Production!

Your NotebookLM Directory MVP is complete and ready for deployment. All core features are implemented, tested, and production-ready.
