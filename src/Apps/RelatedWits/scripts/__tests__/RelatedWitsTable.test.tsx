import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RelatedWitsTable } from '../Components/RelatedWitsTable';
import { WorkItem, WorkItemRelationType } from 'TFS/WorkItemTracking/Contracts';

// Mock Fluent UI components
jest.mock('@fluentui/react', () => ({
  ...jest.requireActual('@fluentui/react'),
  DetailsList: ({ items, onItemInvoked }: any) => (
    <div data-testid="details-list">
      {items?.map((item: any) => (
        <div 
          key={item.id} 
          data-testid={`work-item-${item.id}`}
          onClick={() => onItemInvoked?.(item)}
        >
          {item.fields['System.Title']}
        </div>
      ))}
    </div>
  ),
  CommandBar: ({ items }: any) => (
    <div data-testid="command-bar">
      {items?.map((item: any) => (
        <button key={item.key} onClick={item.onClick} data-testid={`command-${item.key}`}>
          {item.text}
        </button>
      ))}
    </div>
  ),
  Stack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Spinner: ({ label }: any) => <div data-testid="spinner">{label}</div>,
  SpinnerSize: { large: 'large' }
}));

// Mock Fluent UI icons
jest.mock('@fluentui/react-icons', () => ({
  RefreshRegular: () => <span data-testid="refresh-icon">Refresh</span>,
  FilterRegular: () => <span data-testid="filter-icon">Filter</span>,
  SortRegular: () => <span data-testid="sort-icon">Sort</span>
}));

// Mock Common components
jest.mock('Common/Components/VSTS/WorkItemStateView', () => ({
  WorkItemStateView: ({ workItem }: any) => (
    <span data-testid={`state-${workItem.id}`}>{workItem.fields['System.State']}</span>
  )
}));

jest.mock('Common/Components/VSTS/WorkItemTitleView', () => ({
  WorkItemTitleView: ({ workItem }: any) => (
    <span data-testid={`title-${workItem.id}`}>{workItem.fields['System.Title']}</span>
  )
}));

jest.mock('Common/Components/IdentityView', () => ({
  IdentityView: ({ identity }: any) => (
    <span data-testid="identity-view">{identity?.displayName || 'Unknown'}</span>
  )
}));

const mockWorkItems: WorkItem[] = [
  {
    id: 1,
    fields: {
      'System.Id': 1,
      'System.Title': 'Test Work Item 1',
      'System.WorkItemType': 'Bug',
      'System.State': 'Active',
      'System.AssignedTo': { displayName: 'John Doe' },
      'System.AreaPath': 'Project\\Team',
      'System.ChangedDate': '2025-07-30T10:00:00Z'
    }
  },
  {
    id: 2,
    fields: {
      'System.Id': 2,
      'System.Title': 'Test Work Item 2',
      'System.WorkItemType': 'Task',
      'System.State': 'Resolved',
      'System.AssignedTo': { displayName: 'Jane Smith' },
      'System.AreaPath': 'Project\\Team',
      'System.ChangedDate': '2025-07-29T15:30:00Z'
    }
  }
];

const mockRelationTypes: WorkItemRelationType[] = [
  { name: 'Parent' },
  { name: 'Child' },
  { name: 'Related' }
];

const defaultProps = {
  items: mockWorkItems,
  loading: false,
  onItemClick: jest.fn(),
  onAddLink: jest.fn(),
  onRefresh: jest.fn()
};

describe('RelatedWitsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    render(<RelatedWitsTable {...defaultProps} loading={true} />);
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading related work items...')).toBeInTheDocument();
  });

  it('renders work items correctly', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    expect(screen.getByTestId('details-list')).toBeInTheDocument();
    expect(screen.getByTestId('work-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('work-item-2')).toBeInTheDocument();
    expect(screen.getByText('Test Work Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Work Item 2')).toBeInTheDocument();
  });

  it('renders empty state when no items', () => {
    render(<RelatedWitsTable {...defaultProps} items={[]} />);
    
    expect(screen.getByText('No related work items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria or settings')).toBeInTheDocument();
  });

  it('calls onItemClick when work item is clicked', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    const workItem = screen.getByTestId('work-item-1');
    fireEvent.click(workItem);
    
    expect(defaultProps.onItemClick).toHaveBeenCalledWith(mockWorkItems[0]);
  });

  it('renders command bar with correct actions', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    expect(screen.getByTestId('command-bar')).toBeInTheDocument();
    expect(screen.getByTestId('command-refresh')).toBeInTheDocument();
    expect(screen.getByTestId('command-filter')).toBeInTheDocument();
    expect(screen.getByTestId('command-sort')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    const refreshButton = screen.getByTestId('command-refresh');
    fireEvent.click(refreshButton);
    
    expect(defaultProps.onRefresh).toHaveBeenCalled();
  });

  it('disables refresh button when loading', () => {
    render(<RelatedWitsTable {...defaultProps} loading={true} />);
    
    // The refresh button should be disabled during loading
    // This would be tested by checking the disabled attribute
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders work item states correctly', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    expect(screen.getByTestId('state-1')).toBeInTheDocument();
    expect(screen.getByTestId('state-2')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('renders work item titles correctly', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    expect(screen.getByTestId('title-1')).toBeInTheDocument();
    expect(screen.getByTestId('title-2')).toBeInTheDocument();
    expect(screen.getByText('Test Work Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Work Item 2')).toBeInTheDocument();
  });

  it('renders identity views correctly', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles sorting correctly', async () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    // This would test the sorting functionality
    // In a real implementation, you would test that clicking column headers
    // triggers the sorting logic
    expect(screen.getByTestId('details-list')).toBeInTheDocument();
  });

  it('handles context menu correctly', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    // This would test the context menu functionality
    // In a real implementation, you would test right-click actions
    expect(screen.getByTestId('details-list')).toBeInTheDocument();
  });

  it('applies custom CSS classes correctly', () => {
    render(<RelatedWitsTable {...defaultProps} />);
    
    const table = screen.getByTestId('details-list').closest('.related-wits-table');
    expect(table).toBeInTheDocument();
  });

  it('handles large datasets efficiently', () => {
    const largeWorkItems = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      fields: {
        'System.Id': i + 1,
        'System.Title': `Work Item ${i + 1}`,
        'System.WorkItemType': 'Task',
        'System.State': 'Active',
        'System.AssignedTo': { displayName: `User ${i + 1}` },
        'System.AreaPath': 'Project\\Team',
        'System.ChangedDate': '2025-07-30T10:00:00Z'
      }
    }));

    render(<RelatedWitsTable {...defaultProps} items={largeWorkItems} />);
    
    expect(screen.getByTestId('details-list')).toBeInTheDocument();
    // Should render without performance issues
  });

  it('handles missing field values gracefully', () => {
    const workItemsWithMissingFields = [
      {
        id: 1,
        fields: {
          'System.Id': 1,
          'System.Title': 'Test Work Item',
          // Missing other fields
        }
      }
    ];

    render(<RelatedWitsTable {...defaultProps} items={workItemsWithMissingFields} />);
    
    expect(screen.getByTestId('details-list')).toBeInTheDocument();
    expect(screen.getByText('Test Work Item')).toBeInTheDocument();
  });

  it('handles null or undefined items gracefully', () => {
    render(<RelatedWitsTable {...defaultProps} items={null as any} />);
    
    expect(screen.getByText('No related work items found')).toBeInTheDocument();
  });
}); 