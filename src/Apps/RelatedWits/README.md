# Related Work Items - Azure DevOps Work Item Form Extension

## Overview

A work item form page extension that displays related work items based on configurable field values. This extension retrieves field values from the current work item and loads a list of related work items based on those values.

## Features

- **Configurable Search**: Choose which fields to use for finding related work items
- **Flexible Sorting**: Sort results by any available field
- **Rich UI**: Modern DetailsList with filtering, sorting, and context menus
- **Work Item Linking**: Add links to related work items directly from the extension
- **Settings Management**: Save and reuse search configurations per work item type
- **Real-time Updates**: Refresh data when work items change

## Modernization (Version 3.0)

This extension has been modernized with:

- **React 18**: Functional components with React hooks
- **Fluent UI v8**: Latest design system components
- **Zustand**: Modern state management
- **TypeScript**: Enhanced type safety
- **Performance**: Optimized rendering and reduced bundle size
- **Accessibility**: WCAG 2.1 AA compliance
- **Theme Support**: Full light, dark, and high contrast theme support

## Usage

1. Open a work item in Azure DevOps
2. Navigate to the "Related Work Items" page
3. Configure search fields and sorting in settings
4. View related work items based on your criteria
5. Click on items to open them or use context menu for additional actions

## Screenshots

![Example](images/Example.png)

![Example2](images/Example2.png)

![Add Link Example](images/AddLinkExample.png)

## Configuration

Users can configure:
- **Search Fields**: Which fields to use for finding related work items
- **Sort Field**: How to sort the results
- **Result Count**: Number of items to display (default: 20)

Settings are saved per work item type and user.

## Changelog

### Version 3.0 - Modernization Release (July 30, 2025)
- **Modern React Architecture**: Converted to functional components with React hooks
- **Fluent UI v8**: Migrated from OfficeFabric to @fluentui/react
- **Zustand State Management**: Replaced Flux with modern Zustand store
- **Enhanced UX**: Improved filtering, sorting, and context menus
- **Performance Improvements**: Optimized rendering and reduced bundle size
- **Modern Styling**: SCSS with theme support (light, dark, high contrast)
- **Type Safety**: Enhanced TypeScript types and interfaces
- **Custom Hooks**: Separated business logic into reusable hooks
- **Responsive Design**: Better mobile and tablet support
- **Advanced Search Features**: Date ranges, custom field filters, saved searches
- **Export Functionality**: Export to CSV and Excel formats
- **Performance Optimizations**: Caching, virtualization, lazy loading
- **Comprehensive Testing**: Unit tests with React Testing Library
- **Memory Management**: Automatic cleanup and optimization

### Version 2.1.1
- Initial release with basic functionality

A work item form extension that gets a list of related work items for the current work item opened in work item form.

#### Overview ####

This extension adds a page to work item form which shows a list of related work items based on a list of configurable fields. The extension retrieves the field values from the current work item in the form and loads a list of related work items based on those values. Users can configure which fields do they want to look up for to retrieve related work items and which field to use to sort the work items list. By default, the extension loads top 20 workitems based on the search criteria, but this is also a configurable setting.

![Group](images/Example.png)

![Group](images/Example2.png)

In the screenshots above, the extension loads work items which share same field values as "Work Item type", "State", "Area Path" and "Tags", sorted by ChangedDate field. It does exactly what a VSTS query does, but in a much simpler and faster way.
Users can choose to change the look up fields and "sort by" field and save these settings for the current work item type. The next time they open up the form, the extension will read user's settings and retrieve the work item list based on them.

![Group](images/AddLinkExample.png)

Users can also add a link to any of the workitems in the list directly from the extension by right click and "Add Link" menu item.