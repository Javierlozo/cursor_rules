# Cursor Rules Hub

A community-driven platform for sharing and discovering AI behavior rules for the [Cursor Editor](https://cursor.sh). This platform allows developers to create, share, and browse custom rules that enhance the Cursor AI's capabilities.

## About the Project

Cursor Rules Hub is built to help developers:

- Share effective AI behavior rules with the community
- Discover rules for specific frameworks or coding patterns
- Customize how Cursor AI interacts with their code
- Learn best practices for writing Cursor rules

## Features

- 🔍 Browse and search community-created rules
- ✨ Create and share your own rules
- 📁 File pattern matching for rule application
- 🔗 Reference other files in your rules
- 💾 Easy copy-and-paste rule installation
- 🎨 Dark mode interface matching Cursor's theme

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cursor-rules-hub.git
cd cursor-rules-hub
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** Never commit your `.env.local` file to version control. It's already in `.gitignore`.

4. Set up the database:

Run the SQL commands in `src/db/schema.sql` in your Supabase SQL editor to create the necessary tables.

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Using Rules

To use a rule from Cursor Rules Hub:

1. Browse or search for a rule
2. Copy the rule content
3. Create a new file in your project's `.cursor/rules` directory
4. Paste the rule content and save
5. Restart Cursor to apply the new rule

## Contributing

We welcome contributions! Here's how you can help:

1. Share your useful rules
2. Report bugs and suggest features
3. Improve documentation
4. Submit pull requests

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [Supabase](https://supabase.com/) - Backend and Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [React Icons](https://react-icons.github.io/react-icons/) - Icons

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # Reusable React components
├── lib/               # Utilities and configurations
│   ├── supabase.ts   # Supabase client setup
│   └── types/        # TypeScript types
├── db/                # Database schemas and migrations
└── docs/             # Documentation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cursor Editor](https://cursor.sh) team for creating an amazing AI-powered editor
- All contributors who share their rules with the community

## Contact

- GitHub: [Your GitHub Profile](https://github.com/yourusername)
- Twitter: [@YourTwitter](https://twitter.com/yourtwitter)
