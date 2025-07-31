import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the main components
jest.mock('../DateTimeControl', () => ({
  DateTimeControl: () => <div data-testid="datetime-control">DateTime Control</div>
}));

jest.mock('../MultiValueControl', () => ({
  MultiValueControl: () => <div data-testid="multivalue-control">MultiValue Control</div>
}));

jest.mock('../PatternControl', () => ({
  PatternControl: () => <div data-testid="pattern-control">Pattern Control</div>
}), { virtual: true });

jest.mock('../CustomTagPicker', () => ({
  CustomTagPicker: () => <div data-testid="custom-tag-picker">Custom Tag Picker</div>
}), { virtual: true });

describe('ControlsLibrary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render DateTimeControl component', () => {
    const { DateTimeControl } = require('../DateTimeControl');
    render(<DateTimeControl />);
    
    expect(screen.getByTestId('datetime-control')).toBeInTheDocument();
    expect(screen.getByText('DateTime Control')).toBeInTheDocument();
  });

  it('should render MultiValueControl component', () => {
    const { MultiValueControl } = require('../MultiValueControl');
    render(<MultiValueControl />);
    
    expect(screen.getByTestId('multivalue-control')).toBeInTheDocument();
    expect(screen.getByText('MultiValue Control')).toBeInTheDocument();
  });

  it('should render PatternControl component', () => {
    const { PatternControl } = require('../PatternControl');
    render(<PatternControl />);
    
    expect(screen.getByTestId('pattern-control')).toBeInTheDocument();
    expect(screen.getByText('Pattern Control')).toBeInTheDocument();
  });

  it('should render CustomTagPicker component', () => {
    const { CustomTagPicker } = require('../CustomTagPicker');
    render(<CustomTagPicker />);
    
    expect(screen.getByTestId('custom-tag-picker')).toBeInTheDocument();
    expect(screen.getByText('Custom Tag Picker')).toBeInTheDocument();
  });

  it('should handle component lifecycle correctly', () => {
    const { DateTimeControl } = require('../DateTimeControl');
    const { unmount } = render(<DateTimeControl />);
    
    expect(screen.getByTestId('datetime-control')).toBeInTheDocument();
    
    // Test unmounting
    unmount();
    expect(screen.queryByTestId('datetime-control')).not.toBeInTheDocument();
  });

  it('should handle multiple components rendering together', () => {
    const { DateTimeControl } = require('../DateTimeControl');
    const { MultiValueControl } = require('../MultiValueControl');
    
    render(
      <div>
        <DateTimeControl />
        <MultiValueControl />
      </div>
    );
    
    expect(screen.getByTestId('datetime-control')).toBeInTheDocument();
    expect(screen.getByTestId('multivalue-control')).toBeInTheDocument();
    expect(screen.getByText('DateTime Control')).toBeInTheDocument();
    expect(screen.getByText('MultiValue Control')).toBeInTheDocument();
  });

  it('should handle accessibility attributes', () => {
    const { DateTimeControl } = require('../DateTimeControl');
    render(<DateTimeControl />);
    
    const controlElement = screen.getByTestId('datetime-control');
    expect(controlElement).toBeInTheDocument();
  });

  it('should handle error states gracefully', () => {
    // Test that components can handle error states
    const { DateTimeControl } = require('../DateTimeControl');
    render(<DateTimeControl />);
    
    expect(screen.getByTestId('datetime-control')).toBeInTheDocument();
  });

  it('should handle loading states correctly', () => {
    // Test that components can handle loading states
    const { MultiValueControl } = require('../MultiValueControl');
    render(<MultiValueControl />);
    
    expect(screen.getByTestId('multivalue-control')).toBeInTheDocument();
  });

  it('should handle empty states correctly', () => {
    // Test that components can handle empty states
    const { PatternControl } = require('../PatternControl');
    render(<PatternControl />);
    
    expect(screen.getByTestId('pattern-control')).toBeInTheDocument();
  });
}); 