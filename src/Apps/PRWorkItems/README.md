# Create a new workitem and link it to your Pull request

Have you ever come across a situation where you created a Pull request but forgot to create a work item for it? Now you can quickly create a workitem and associate it to your Pull request right from the PR page.

Just click on the new "Link to a new workitem" menu item to open a work item dialog. Enter the work item details in the dialog and hit save and this extension will automatically link the new workitem with your Pull request.

P.S. - The extension creates the work item and adds the link using Rest API, so the Pull request page won't show the new linked workitem right away. You'll need to refresh the page to see it.

![Group](images/demo.png)

## Version 3.0.0 - Modernization Update

### 🚀 **Major Modernization Changes**

This version represents a complete modernization of the PRWorkItems extension, bringing it in line with current best practices and modern development standards.

#### **Technical Improvements**
- **React 18**: Upgraded to the latest React version with modern patterns
- **Fluent UI v8**: Migrated from OfficeFabric to the latest Fluent UI design system
- **TypeScript**: Enhanced type safety throughout the application
- **Modern Hooks**: Implemented custom React hooks for business logic
- **Functional Components**: Converted all class components to modern functional components

#### **Architecture Enhancements**
- **Custom Hooks**: `usePRWorkItems` for centralized state management
- **Modern Types**: Comprehensive TypeScript interfaces and type definitions
- **Component Structure**: Modular component architecture with proper separation of concerns
- **Error Handling**: Improved error handling with user-friendly messages
- **Loading States**: Enhanced loading indicators and user feedback

#### **User Experience Improvements**
- **Responsive Design**: Mobile and tablet support
- **Theme Support**: Light, dark, and high contrast mode compatibility
- **Accessibility**: WCAG 2.1 AA compliance features
- **Performance**: Optimized rendering and state management
- **Modern UI**: Updated interface with Fluent UI v8 components

#### **Developer Experience**
- **Modern Build System**: Updated webpack configuration
- **Code Organization**: Improved file structure and naming conventions
- **Type Safety**: Enhanced TypeScript integration
- **Testing Ready**: Architecture prepared for comprehensive testing

### **Features**
- Create work items directly from pull request context menu
- Configure which work item types are available
- Automatic linking of created work items to pull requests
- Modern, responsive user interface
- Theme-aware design system

### **Installation**
1. Install the extension from the Azure DevOps marketplace
2. Navigate to any pull request
3. Use the "Link to a new workitem" context menu option
4. Configure work item types in the settings dialog

### **Configuration**
- Access configuration through the context menu "Configure" option
- Select which work item types should be available for creation
- Settings are saved per project

### **Technical Details**
- **Framework**: React 18 with TypeScript
- **UI Library**: Fluent UI v8
- **State Management**: Custom React hooks
- **Build System**: Webpack with modern optimizations
- **Browser Support**: Modern browsers with ES6+ support

### **Breaking Changes**
- This is a major version upgrade (3.0.0) with significant architectural changes
- Requires Azure DevOps 2020 or later
- Modern browser support required

### **Migration Notes**
- Existing configurations will be automatically migrated
- No user action required for existing installations
- Enhanced performance and reliability

---

**Developer**: Bill Curtis  
**Last Updated**: July 30, 2025  
**Version**: 3.0.0
