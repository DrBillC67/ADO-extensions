const React = require('react');

// Mock all Fluent UI icons
const createIconMock = (name) => {
  return (props) => React.createElement('span', { 
    'data-testid': `${name.toLowerCase()}-icon`,
    ...props 
  }, name);
};

module.exports = {
  RefreshRegular: createIconMock('Refresh'),
  FilterRegular: createIconMock('Filter'),
  SortRegular: createIconMock('Sort'),
  AddRegular: createIconMock('Add'),
  EditRegular: createIconMock('Edit'),
  DeleteRegular: createIconMock('Delete'),
  SearchRegular: createIconMock('Search'),
  SettingsRegular: createIconMock('Settings'),
  CloseRegular: createIconMock('Close'),
  CheckmarkRegular: createIconMock('Checkmark'),
  WarningRegular: createIconMock('Warning'),
  ErrorRegular: createIconMock('Error'),
  InfoRegular: createIconMock('Info'),
  // Add more icons as needed
}; 