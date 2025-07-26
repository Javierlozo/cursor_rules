# Cursor Rules Hub

A community-driven platform for sharing and discovering AI behavior rules for the [Cursor Editor](https://cursor.sh). This platform allows developers to create, share, and browse custom rules that enhance the Cursor AI's capabilities.

## 🚀 Production Ready!

**Status: Live** ✅

The Cursor Rules Hub is now live with all core features implemented:

### ✅ MVP Features
- **User Authentication** - Complete signup/login system with Supabase
- **Rule Management** - Create, edit, browse, and search cursor rules
- **Community Features** - Share rules, track downloads and likes
- **Admin Dashboard** - User management and platform statistics
- **Templates System** - Pre-built rule templates for quick start
- **User Onboarding** - Interactive tour for new users
- **Responsive Design** - Works on desktop and mobile
- **Error Handling** - Comprehensive error states and loading indicators

### 🎯 What's Included
- 8 high-quality sample rules covering React, TypeScript, API patterns, testing, and more
- 10 predefined categories for easy organization
- Template system for quick rule creation
- Search and filtering capabilities
- User-friendly onboarding flow

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
- 👥 User authentication and profiles
- 📊 Admin dashboard for platform management
- 🎯 Interactive onboarding for new users

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/cursor-rules-hub.git
cd cursor-rules-hub
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Database Setup

1. **Run migrations in order:**
   ```bash
   # Run these migrations in sequence:
   supabase/migrations/20241220000016_create_basic_tables_safe.sql
   supabase/migrations/20241220000014_handle_existing_tables.sql
   ```
   
   **Migration Overview:**
   
   - **Step 1:** `20241220000016_create_basic_tables_safe.sql` - Creates core tables (categories, cursor_rules, rule_downloads, rule_likes)
   - **Step 2:** `20241220000014_handle_existing_tables.sql` - Adds social features (user_profiles, user_follows, notifications)

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Quick Deployment Script

```bash
./scripts/deploy.sh
```

### Manual Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform:**
   - **Vercel:** `vercel --prod`
   - **Netlify:** `netlify deploy --prod`
   - **Railway:** `railway up`

3. **Configure environment variables** in your hosting platform

4. **Test the application** thoroughly

## Using Rules

To use a rule from Cursor Rules Hub:

1. Browse or search for a rule
2. Copy the rule content
3. Create a new file in your project's `.cursor/rules` directory
4. Paste the rule content and save
5. Restart Cursor to apply the new rule

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── auth/           # Authentication pages
│   ├── cursor-rules/   # Rule management pages
│   ├── admin/          # Admin dashboard
│   └── api/            # API routes
├── components/         # Reusable React components
│   ├── cursor-rules/   # Rule-specific components
│   ├── layout/         # Layout components
│   └── OnboardingModal.tsx
├── contexts/           # React contexts
├── lib/               # Utilities and configurations
│   ├── supabase.ts    # Supabase client setup
│   └── types/         # TypeScript types
└── supabase/          # Database migrations and seed data
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React Framework with App Router
- [Supabase](https://supabase.com/) - Backend, Database, and Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## Contributing

We welcome contributions! Here's how you can help:

1. **Share your rules** - Create and share useful cursor rules
2. **Report bugs** - Help us improve the platform
3. **Suggest features** - Propose new functionality
4. **Improve documentation** - Make the platform easier to use
5. **Submit pull requests** - Contribute code improvements

### Development Guidelines

- Follow TypeScript best practices
- Use consistent code formatting
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## Roadmap

### Phase 1: Core Platform ✅
- [x] Core rule management system
- [x] User authentication
- [x] Admin dashboard
- [x] Sample rules and templates
- [x] User onboarding

### Phase 2: AI Features (Coming Soon)
- [ ] AI-powered rule generation
- [ ] Smart rule recommendations
- [ ] Content moderation AI
- [ ] Personalized rule suggestions

### Phase 3: Advanced Features
- [ ] Rule versioning and history
- [ ] Advanced search and filtering
- [ ] Rule analytics and insights
- [ ] Community features (comments, reviews)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cursor Editor](https://cursor.sh) team for creating an amazing AI-powered editor
- All contributors who share their rules with the community
- The open-source community for the amazing tools that make this possible

## Support

- **Documentation:** [Project Wiki](link-to-wiki)
- **Issues:** [GitHub Issues](link-to-issues)
- **Discussions:** [GitHub Discussions](link-to-discussions)
- **Email:** support@cursor-rules-hub.com

---

**Ready to transform your coding workflow?** 🚀

Join the Cursor Rules Hub community and start sharing your AI behavior rules today!
