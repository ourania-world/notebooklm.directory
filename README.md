# NotebookLM Directory

A minimal, static frontend for browsing and sharing NotebookLM projects.

## Features

- **Static HTML/CSS/JS**: No frameworks, no bloat, just speed and simplicity
- **Supabase Backend**: Connects to Supabase for data storage and retrieval
- **Responsive Design**: Works on all devices with a clean, modern UI
- **Notebook Submission**: Submit your NotebookLM projects to the directory
- **Category Filtering**: Filter notebooks by category
- **Search**: Search for notebooks by title, description, author, or tags
- **Detail View**: View detailed information about each notebook

## Getting Started

### Prerequisites

- A Supabase account and project
- Basic knowledge of HTML, CSS, and JavaScript

### Setup

1. Clone this repository
2. Update the Supabase URL and anon key in the JavaScript section of `index.html`
3. Deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.)

```bash
# Example deployment with Vercel
vercel

# Example deployment with Netlify
netlify deploy
```

## Project Structure

- `index.html` - Main page with notebook listing
- `detail.html` - Notebook detail page
- `styles.css` - Custom styles
- `favicon.ico` - Site favicon

## Database Schema

The application expects a `notebooks` table in Supabase with the following structure:

```sql
CREATE TABLE notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('Academic', 'Business', 'Creative', 'Research', 'Education', 'Personal')),
  tags text[] DEFAULT '{}',
  author text NOT NULL,
  institution text,
  notebook_url text NOT NULL,
  audio_overview_url text,
  featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  save_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read notebooks"
  ON notebooks
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert notebooks
CREATE POLICY "Authenticated users can insert notebooks"
  ON notebooks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

## Future Enhancements

- User authentication for profile-based submission management
- Lazy loading or infinite scroll for notebooks
- Advanced filtering and sorting options
- Comments and social features
- Analytics dashboard for notebook authors

## Contributing 

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.com/) for the backend services
- [Inter Font](https://rsms.me/inter/) for the typography
