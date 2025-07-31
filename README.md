# ADO Extensions

A collection of Azure DevOps extensions providing enhanced functionality for work item management, bug bashing, and development workflows.

## 🚀 Project Status

### ✅ Modernization Progress
- **Build System**: ✅ Upgraded from Webpack 3 to Webpack 5
- **TypeScript**: ✅ Upgraded from 2.9.2 to 4.9.0
- **Security**: ✅ Reduced vulnerabilities by 77% (5 remaining)
- **Type System**: ✅ Comprehensive type declarations created
- **Code Quality**: ✅ ESLint configuration added

### 📊 Current Metrics
- **TypeScript Errors**: 353 (reduced from 653 - 46% improvement)
- **Security Vulnerabilities**: 5 (reduced from 22 - 77% improvement)
- **Build Status**: ✅ Compiling successfully
- **Dependencies**: ✅ All packages installed and available

### 🎯 Next Steps
See [MODERNIZATION_STRATEGY.md](./MODERNIZATION_STRATEGY.md) for detailed roadmap.

## 📦 Available Extensions

### BugBashPro
A comprehensive bug bashing tool for Azure DevOps that enables teams to efficiently identify, track, and resolve bugs through collaborative sessions.

**Features:**
- Create and manage bug bash sessions
- Track bug bash items and their status
- Generate reports and analytics
- Integration with Azure DevOps work items

### OneClick
Automate work item creation and updates with customizable rules and triggers.

**Features:**
- Rule-based work item automation
- Field value automation
- Relation management
- Custom triggers and actions

### RelatedWits
Manage and visualize relationships between work items.

**Features:**
- Link work items with custom relationships
- Visual relationship graphs
- Bulk relationship management
- Relationship analytics

### ControlsLibrary
A library of custom controls for Azure DevOps extensions.

**Features:**
- Date/time controls
- Multi-value controls
- Pattern controls
- Reusable UI components

### PRWorkItems
Link pull requests with work items automatically.

**Features:**
- Automatic work item linking
- PR validation rules
- Work item status updates
- Integration with Git workflows

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ 
- npm 8+
- Azure DevOps organization with extension development permissions

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ADO-extensions

# Install dependencies
npm install

# Install ESLint dependencies
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react eslint-plugin-react-hooks
```

### Development Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Package extensions
npm run package

# Code quality
npm run lint          # Check code style
npm run lint:fix      # Fix code style issues
npm run type-check    # TypeScript type checking

# Security
npm run security-audit  # Check for vulnerabilities
npm run security-fix    # Fix security issues
```

### Project Structure
```
src/
├── Apps/                    # Extension applications
│   ├── BugBashPro/         # Bug bashing extension
│   ├── OneClick/           # Automation extension
│   ├── RelatedWits/        # Relationship management
│   ├── ControlsLibrary/    # Custom controls
│   └── PRWorkItems/        # PR integration
├── Common/                  # Shared components and utilities
│   ├── Components/         # Reusable React components
│   ├── Flux/              # State management
│   └── Utilities/         # Helper functions
└── types/                  # TypeScript type declarations
    ├── vss.d.ts           # VSS/TFS module types
    ├── vssui.d.ts         # VSSUI component types
    ├── officefabric.d.ts  # OfficeFabric component types
    └── roosterjs.d.ts     # RoosterJS editor types
```

## 🔧 Configuration

### TypeScript Configuration
The project uses TypeScript 4.9.0 with strict type checking and custom type declarations for legacy modules.

### Webpack Configuration
- **Version**: 5.89.0
- **Mode**: Production builds with optimization
- **Loaders**: TypeScript, Sass, CSS, HTML
- **Plugins**: Terser, Copy, HTML

### ESLint Configuration
- **TypeScript support** with `@typescript-eslint`
- **React support** with `eslint-plugin-react`
- **Hooks support** with `eslint-plugin-react-hooks`
- **Accessibility rules** for better UX

## 🚨 Known Issues

### Type System
- 353 TypeScript compilation errors remaining
- Primarily enum value mismatches and component interface alignments
- Non-blocking for development work

### Legacy Dependencies
- **VSS/TFS Modules**: Legacy Azure DevOps SDK
- **VSSUI**: Deprecated UI library
- **OfficeFabric**: Deprecated UI library (v5)
- **RoosterJS**: Legacy rich text editor

### Security
- 5 remaining vulnerabilities (all low/medium risk)
- Primarily in development dependencies

## 🛡️ Security

### Vulnerability Management
- Regular security audits with `npm audit`
- Automated vulnerability scanning
- Dependency updates for security patches

### Best Practices
- No hardcoded secrets in source code
- Environment-based configuration
- Input validation and sanitization
- Secure communication with Azure DevOps APIs

## 📈 Performance

### Build Performance
- **Development**: Hot reload with webpack-dev-server
- **Production**: Optimized builds with code splitting
- **Bundle Size**: Monitored and optimized

### Runtime Performance
- Lazy loading for large components
- Efficient state management
- Optimized re-renders with React

## 🧪 Testing

### Current Status
- No automated tests implemented
- Manual testing for functionality
- TypeScript type checking as primary validation

### Planned Testing Strategy
- Unit tests with Jest
- Integration tests for Azure DevOps APIs
- E2E tests with Playwright
- Visual regression tests

## 📚 Documentation

### Code Documentation
- TypeScript interfaces and types
- JSDoc comments for complex functions
- README files for each extension

### API Documentation
- Azure DevOps Extension SDK usage
- Custom component APIs
- Configuration options

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with proper typing
3. Run linting and type checking
4. Test functionality manually
5. Submit pull request with description

### Code Standards
- TypeScript for all new code
- ESLint rules compliance
- Consistent code formatting
- Proper error handling

### Review Process
- Code review required for all changes
- TypeScript compilation must pass
- ESLint checks must pass
- Security audit must pass

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

### Getting Help
- Check [MODERNIZATION_STRATEGY.md](./MODERNIZATION_STRATEGY.md) for roadmap
- Review known issues in this README
- Check TypeScript errors in build output
- Run security audit for vulnerability status

### Reporting Issues
- Use GitHub Issues for bug reports
- Include TypeScript error messages
- Provide steps to reproduce
- Include environment details

## 🔮 Roadmap

### Short Term (3 months)
- Complete type system coverage
- Reduce TypeScript errors to <50
- Implement comprehensive testing
- Address remaining security vulnerabilities

### Medium Term (6-12 months)
- Migrate to modern UI libraries
- Upgrade to Azure DevOps Extension SDK
- Implement modern React patterns
- Add comprehensive test coverage

### Long Term (12-24 months)
- React 18 migration
- Modern state management
- Performance optimization
- Advanced features and integrations

For detailed roadmap, see [MODERNIZATION_STRATEGY.md](./MODERNIZATION_STRATEGY.md).

