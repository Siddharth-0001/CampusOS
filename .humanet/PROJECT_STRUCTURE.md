# CampusOS Project Structure

## Final Directory Layout

```
campus-os/
│
├── .humanet/                   # Idea documentation (source of truth)
│   ├── config.yml
│   ├── problem_statement.md
│   ├── idea.md
│   ├── scope.md
│   ├── CHANGELOG.md
│   ├── CONTRIBUTORS.md
│   ├── discussions/            # Architecture decision records
│   ├── research/               # Supporting materials
│   ├── diagrams/               # Visual documentation
│   ├── evaluations/            # AI validation reports
│   └── templates/              # Reusable templates
│
├── backend/                    # Express core
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── app.js             # Express app setup
│   │   ├── plugin-loader.js   # Dynamic module loader
│   │   ├── middleware/        # Request middleware
│   │   └── utils/             # Shared utilities
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # Next.js UI
│   ├── src/
│   │   ├── app/               # App router and pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Frontend utilities
│   │   └── styles/            # Tailwind/CSS
│   ├── package.json
│   └── next.config.js
│
├── apps/                       # Feature modules (all features here)
│   ├── auth/                  # Auth module
│   │   ├── routes.js
│   │   ├── controller.js
│   │   ├── service.js
│   │   ├── schema.js
│   │   └── plugin.js
│   ├── users/
│   ├── clubs/
│   ├── events/
│   ├── tasks/
│   ├── vendors/
│   ├── sponsors/
│   └── [other-modules]/
│
├── shared/                     # Shared types and utilities
│   ├── types/                 # TypeScript types
│   ├── schemas/               # Validation schemas
│   ├── constants/             # Global constants
│   └── utils/                 # Shared utilities
│
├── .humanet/                  # Humanet documentation
├── COPILOT.md                 # Copilot system rules
├── ROADMAP.md                 # Development roadmap
├── package.json               # Root package.json with workspace configuration
├── .gitignore
└── README.md
```

## Module Structure (Each Feature)

Every module in `/apps/` follows this structure:

```
apps/module-name/
├── routes.js         # Express routes
├── controller.js     # Request handlers
├── service.js        # Business logic
├── schema.js         # Data model/validation
├── plugin.js         # Plugin entry point
└── [tests]/          # Test files
```

## Key Concepts

### Plugin System
- Plugin loader scans `/apps/` directory
- Each module exports: `name`, `routes`, `init()`
- Modules are loaded dynamically at startup
- No module-to-module direct imports

### Layers
- Foundation (Auth, Users, Clubs, RBAC)
- Event (Events, RSVP, Check-in)
- Execution (Tasks, Calendar, Workflows)
- Operations (Vendors, Resources, Budget)
- Growth (Sponsorship, Marketing)
- System (Notifications, Audit, Analytics)
