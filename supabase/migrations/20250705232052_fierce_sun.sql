/*
  # Add More Notebooks to Directory
  
  1. New Content
    - Add 20 additional high-quality notebooks across various categories
    - Ensure diverse topics, authors, and institutions
    - Include realistic metadata and engagement metrics
  
  2. Categories
    - Ensure balanced distribution across all categories
    - Add specialized subcategories through tags
  
  3. Quality
    - High-quality descriptions and metadata
    - Realistic engagement metrics
    - Varied featured status
*/

-- Insert additional academic notebooks
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured, view_count, save_count)
VALUES
(
  'Quantum Computing Research Analysis',
  'Comprehensive analysis of recent quantum computing breakthroughs using NotebookLM to synthesize findings from 75+ research papers and identify emerging patterns in quantum supremacy experiments.',
  'Academic',
  ARRAY['Quantum Computing', 'Physics', 'Computer Science', 'Research Synthesis'],
  'Dr. Emily Zhang',
  'MIT Quantum Lab',
  'https://notebooklm.google.com/notebook/quantum-research',
  true,
  2456,
  187
),
(
  'Climate Change Meta-Analysis',
  'Meta-analysis of climate change research from 2020-2025, examining methodological approaches, consensus findings, and research gaps using NotebookLM to process over 200 peer-reviewed papers.',
  'Academic',
  ARRAY['Climate Science', 'Meta-Analysis', 'Environmental Research', 'Sustainability'],
  'Prof. David Johnson',
  'Stanford Earth Sciences',
  'https://notebooklm.google.com/notebook/climate-meta-analysis',
  true,
  3782,
  291
),
(
  'Neuroscience Literature Review',
  'Comprehensive literature review of advances in neuroplasticity research, with NotebookLM-assisted analysis of experimental methodologies and findings across 120+ studies from 2018-2025.',
  'Academic',
  ARRAY['Neuroscience', 'Neuroplasticity', 'Literature Review', 'Brain Research'],
  'Dr. Maria Rodriguez',
  'Harvard Medical School',
  'https://notebooklm.google.com/notebook/neuro-review',
  false,
  1845,
  143
);

-- Insert additional business notebooks
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured, view_count, save_count)
VALUES
(
  'Market Entry Strategy Framework',
  'Comprehensive framework for market entry strategy development, built with NotebookLM analyzing 50+ successful and failed market entries across industries to identify critical success factors.',
  'Business',
  ARRAY['Market Strategy', 'Business Development', 'Competitive Analysis', 'Market Entry'],
  'Sarah Williams',
  'McKinsey & Company',
  'https://notebooklm.google.com/notebook/market-entry-strategy',
  true,
  4231,
  378
),
(
  'Venture Capital Investment Analysis',
  'Analysis of venture capital investment patterns in emerging technologies from 2020-2025, using NotebookLM to process investment data, founder interviews, and market trends.',
  'Business',
  ARRAY['Venture Capital', 'Investment', 'Startups', 'Emerging Tech'],
  'Michael Chen',
  'Sequoia Capital',
  'https://notebooklm.google.com/notebook/vc-analysis',
  false,
  2876,
  219
),
(
  'ESG Reporting Framework',
  'Comprehensive ESG (Environmental, Social, Governance) reporting framework developed using NotebookLM to analyze best practices across Fortune 500 companies and regulatory requirements.',
  'Business',
  ARRAY['ESG', 'Sustainability', 'Corporate Reporting', 'Compliance'],
  'Dr. Jessica Martinez',
  'Sustainable Business Institute',
  'https://notebooklm.google.com/notebook/esg-framework',
  true,
  3542,
  267
);

-- Insert additional creative notebooks
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured, view_count, save_count)
VALUES
(
  'Narrative Structure Analysis',
  'In-depth analysis of narrative structures in award-winning novels from the past decade, using NotebookLM to identify patterns, turning points, and character development arcs.',
  'Creative',
  ARRAY['Creative Writing', 'Narrative Analysis', 'Literary Techniques', 'Storytelling'],
  'Emma Thompson',
  'Creative Writing Workshop',
  'https://notebooklm.google.com/notebook/narrative-analysis',
  true,
  2987,
  245
),
(
  'Visual Storytelling Techniques',
  'Comprehensive study of visual storytelling techniques across film, animation, and graphic novels, with NotebookLM-assisted analysis of composition, color theory, and emotional impact.',
  'Creative',
  ARRAY['Visual Storytelling', 'Film Analysis', 'Animation', 'Graphic Design'],
  'Robert Kim',
  'California Institute of the Arts',
  'https://notebooklm.google.com/notebook/visual-storytelling',
  false,
  1876,
  156
),
(
  'Music Composition Patterns',
  'Analysis of composition patterns in Billboard Top 100 songs from 2010-2025, using NotebookLM to identify melodic structures, chord progressions, and production techniques that correlate with commercial success.',
  'Creative',
  ARRAY['Music Analysis', 'Composition', 'Songwriting', 'Music Production'],
  'Alicia Johnson',
  'Berklee College of Music',
  'https://notebooklm.google.com/notebook/music-composition',
  false,
  2134,
  178
);

-- Insert additional research notebooks
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured, view_count, save_count)
VALUES
(
  'AI Ethics Framework Development',
  'Development of a comprehensive AI ethics framework based on analysis of existing guidelines, case studies, and ethical dilemmas, processed and synthesized using NotebookLM.',
  'Research',
  ARRAY['AI Ethics', 'Responsible AI', 'Technology Ethics', 'Framework Development'],
  'Dr. James Wilson',
  'Oxford Internet Institute',
  'https://notebooklm.google.com/notebook/ai-ethics-framework',
  true,
  5432,
  421
),
(
  'Genomic Data Analysis Methods',
  'Comparative analysis of genomic data processing methodologies, using NotebookLM to synthesize findings from 80+ research papers and identify optimal approaches for different research questions.',
  'Research',
  ARRAY['Genomics', 'Bioinformatics', 'Data Analysis', 'Research Methods'],
  'Dr. Samantha Lee',
  'Broad Institute',
  'https://notebooklm.google.com/notebook/genomic-analysis',
  false,
  2765,
  198
),
(
  'Renewable Energy Technology Comparison',
  'Comprehensive comparison of emerging renewable energy technologies, with NotebookLM-assisted analysis of efficiency metrics, cost factors, implementation challenges, and environmental impact.',
  'Research',
  ARRAY['Renewable Energy', 'Sustainability', 'Technology Assessment', 'Clean Tech'],
  'Dr. Michael Brown',
  'National Renewable Energy Laboratory',
  'https://notebooklm.google.com/notebook/renewable-comparison',
  true,
  3987,
  312
);

-- Insert additional education notebooks
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured, view_count, save_count)
VALUES
(
  'Effective Online Learning Design',
  'Research-based framework for designing effective online learning experiences, developed using NotebookLM to analyze student engagement data, learning outcomes, and instructional design best practices.',
  'Education',
  ARRAY['Online Learning', 'Instructional Design', 'E-Learning', 'Education Technology'],
  'Prof. Lisa Park',
  'Stanford Graduate School of Education',
  'https://notebooklm.google.com/notebook/online-learning-design',
  true,
  4321,
  356
),
(
  'STEM Education Innovation',
  'Analysis of innovative STEM education approaches worldwide, using NotebookLM to identify best practices, engagement strategies, and assessment methods that improve learning outcomes.',
  'Education',
  ARRAY['STEM Education', 'Educational Innovation', 'Teaching Methods', 'Learning Assessment'],
  'Dr. Thomas Chen',
  'MIT Teaching Systems Lab',
  'https://notebooklm.google.com/notebook/stem-innovation',
  false,
  2543,
  187
),
(
  'Adaptive Learning Systems Analysis',
  'Comprehensive analysis of adaptive learning systems and personalized education technologies, with NotebookLM-assisted evaluation of effectiveness, implementation strategies, and student outcomes.',
  'Education',
  ARRAY['Adaptive Learning', 'Personalized Education', 'EdTech', 'Learning Analytics'],
  'Dr. Rachel Williams',
  'Carnegie Mellon Learning Lab',
  'https://notebooklm.google.com/notebook/adaptive-learning',
  true,
  3765,
  289
);

-- Insert additional personal notebooks
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured, view_count, save_count)
VALUES
(
  'Productivity System Design',
  'Personal productivity system design based on analysis of 25+ methodologies (GTD, Pomodoro, etc.) using NotebookLM to identify optimal approaches for different work styles and contexts.',
  'Personal',
  ARRAY['Productivity', 'Time Management', 'Personal Development', 'Work Methods'],
  'Alex Kim',
  'Personal Project',
  'https://notebooklm.google.com/notebook/productivity-system',
  false,
  3876,
  312
),
(
  'Nutrition Research Analysis',
  'Comprehensive analysis of nutrition research from 2018-2025, using NotebookLM to identify evidence-based approaches to diet optimization for health, athletic performance, and longevity.',
  'Personal',
  ARRAY['Nutrition', 'Health Research', 'Diet Optimization', 'Wellness'],
  'Dr. Emily Johnson',
  'Independent Researcher',
  'https://notebooklm.google.com/notebook/nutrition-analysis',
  true,
  4532,
  387
),
(
  'Language Learning Methodology',
  'Analysis of polyglot techniques and language acquisition research, using NotebookLM to develop an optimized approach to learning multiple languages efficiently based on cognitive science.',
  'Personal',
  ARRAY['Language Learning', 'Polyglot Methods', 'Cognitive Science', 'Skill Acquisition'],
  'David Martinez',
  'Personal Project',
  'https://notebooklm.google.com/notebook/language-learning',
  false,
  2987,
  243
);

-- Insert additional premium content notebooks
INSERT INTO notebooks (title, description, category, tags, author, institution, notebook_url, featured, view_count, save_count, premium)
VALUES
(
  'Advanced AI Research Methodology',
  'Comprehensive methodology for conducting cutting-edge AI research, developed by analyzing approaches from top AI labs and researchers using NotebookLM to synthesize best practices.',
  'Research',
  ARRAY['AI Research', 'Methodology', 'Machine Learning', 'Research Design'],
  'Dr. Alan Turing Institute',
  'DeepMind',
  'https://notebooklm.google.com/notebook/ai-research-methods',
  true,
  6543,
  521,
  true
),
(
  'Venture Capital Due Diligence Playbook',
  'Comprehensive venture capital due diligence framework developed using NotebookLM to analyze successful investment decisions and failure cases across 200+ startup investments.',
  'Business',
  ARRAY['Venture Capital', 'Due Diligence', 'Investment', 'Startup Evaluation'],
  'Sarah Tavel',
  'Benchmark Capital',
  'https://notebooklm.google.com/notebook/vc-due-diligence',
  true,
  5432,
  478,
  true
);

-- Update view counts and save counts for existing notebooks to make them more realistic
UPDATE notebooks 
SET 
  view_count = CASE 
    WHEN featured = true THEN floor(random() * 3000) + 2000
    ELSE floor(random() * 2000) + 500
  END,
  save_count = CASE 
    WHEN featured = true THEN floor(random() * 300) + 150
    ELSE floor(random() * 150) + 50
  END
WHERE view_count IS NULL OR view_count < 100;