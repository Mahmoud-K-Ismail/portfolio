# Neural Network Portfolio

An interactive 3D portfolio built with Next.js that visualizes background, skills, and experience as a neural network / knowledge graph.

![Portfolio Preview](preview.png)

## ✨ Features

- **Interactive Graph Visualization** - Explore experience as interconnected nodes
- **AI Career Assistant (RAG)** - Ask questions about experience, projects, and skills
- **Glassmorphism UI** - Beautiful frosted glass detail panels
- **Search & Filter** - Find specific skills or projects instantly
- **Resume PDF Download** - Direct access to full resume
- **Smooth Animations** - Powered by Framer Motion
- **Fully Responsive** - Works on desktop and mobile
- **Dark Theme** - Easy on the eyes with glowing nodes

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Visualization:** react-force-graph-2d
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git

# Navigate to the project
cd portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setup

1. **Add Resume PDF**: Place your resume PDF file in the `public` folder as `resume.pdf`
   ```bash
   cp /path/to/your/resume.pdf public/resume.pdf
   ```

2. **Mistral AI API for RAG Chat** (Recommended):
   - Create a `.env.local` file in the root directory
   - Add your Mistral API key:
     ```
     MISTRAL_API_KEY=your_api_key_here
     ```
   - Without the API key, the chat will use a simple keyword-based fallback system
   - Get your free API key at [console.mistral.ai](https://console.mistral.ai)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── rag/
│   │       └── route.ts    # RAG API endpoint for career questions
│   ├── globals.css         # Global styles & theme
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main portfolio page
├── components/
│   ├── GraphContainer.tsx  # Force graph visualization
│   ├── DetailPanel.tsx     # Glassmorphism detail panel
│   ├── SearchBar.tsx       # Search & filter component
│   └── RAGChat.tsx         # AI career assistant chat
└── lib/
    └── graphData.ts        # Node & link data structure
```

## 🎨 Customization

### Adding New Nodes

Edit `src/lib/graphData.ts` to add new experiences, projects, or skills:

```typescript
// Add a new node
{
  id: 'new-project',
  name: 'My New Project',
  type: 'item',
  color: '#a855f7',
  size: 12,
  details: {
    title: 'My New Project',
    subtitle: 'Description',
    bullets: ['Feature 1', 'Feature 2'],
    technologies: ['React', 'Node.js'],
  },
}

// Connect it with a link
{ source: 'projects', target: 'new-project' }
```

### Changing Colors

Colors are defined at the top of `graphData.ts`:

```typescript
const colors = {
  root: '#ffffff',      // White - main node
  category: '#3b82f6',  // Blue - categories
  item: '#a855f7',      // Purple - items
  skill: '#22c55e',     // Green - skills
};
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Click "Deploy" - Vercel auto-detects Next.js

### GitHub Pages

1. Uncomment `output: 'export'` in `next.config.ts`
2. Run `npm run build`
3. Deploy the `out` folder to GitHub Pages

## 📜 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Credits

Built with ❤️ by Mahmoud Kassem
