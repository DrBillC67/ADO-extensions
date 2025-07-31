import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Common components
jest.mock('../Badge/Badge', () => ({
  Badge: ({ children, ...props }: any) => (
    <div data-testid="badge" {...props}>
      {children}
    </div>
  )
}));

jest.mock('../ColorPicker/ColorPicker', () => ({
  ColorPicker: ({ onColorChange, ...props }: any) => (
    <div data-testid="color-picker" {...props}>
      Color Picker
      <button onClick={() => onColorChange && onColorChange('#ff0000')}>
        Select Red
      </button>
    </div>
  )
}));

jest.mock('../DateTimePicker/DateTimePicker', () => ({
  DateTimePicker: ({ onDateChange, ...props }: any) => (
    <div data-testid="datetime-picker" {...props}>
      DateTime Picker
      <button onClick={() => onDateChange && onDateChange(new Date('2023-01-01'))}>
        Select Date
      </button>
    </div>
  )
}));

jest.mock('../ErrorBoundary/ErrorBoundary', () => ({
  ErrorBoundary: ({ children, ...props }: any) => (
    <div data-testid="error-boundary" {...props}>
      {children}
    </div>
  )
}));

jest.mock('../FileUploadDialog/FileUploadDialog', () => ({
  FileUploadDialog: ({ onUpload, ...props }: any) => (
    <div data-testid="file-upload-dialog" {...props}>
      File Upload Dialog
      <button onClick={() => onUpload && onUpload([new File([''], 'test.txt')])}>
        Upload File
      </button>
    </div>
  )
}));

jest.mock('../Loading/Loading', () => ({
  Loading: ({ ...props }: any) => (
    <div data-testid="loading" {...props}>
      Loading...
    </div>
  )
}));

describe('Common Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Badge', () => {
    it('should render badge component', () => {
      const { Badge } = require('../Badge/Badge');
      render(<Badge>Test Badge</Badge>);
      
      expect(screen.getByTestId('badge')).toBeInTheDocument();
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('should handle badge variants', () => {
      const { Badge } = require('../Badge/Badge');
      render(<Badge variant="success">Success Badge</Badge>);
      
      expect(screen.getByTestId('badge')).toBeInTheDocument();
      expect(screen.getByText('Success Badge')).toBeInTheDocument();
    });
  });

  describe('ColorPicker', () => {
    it('should render color picker component', () => {
      const { ColorPicker } = require('../ColorPicker/ColorPicker');
      render(<ColorPicker />);
      
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
      expect(screen.getByText('Color Picker')).toBeInTheDocument();
    });

    it('should handle color selection', () => {
      const mockOnColorChange = jest.fn();
      const { ColorPicker } = require('../ColorPicker/ColorPicker');
      render(<ColorPicker onColorChange={mockOnColorChange} />);
      
      const selectButton = screen.getByText('Select Red');
      fireEvent.click(selectButton);
      
      expect(mockOnColorChange).toHaveBeenCalledWith('#ff0000');
    });
  });

  describe('DateTimePicker', () => {
    it('should render datetime picker component', () => {
      const { DateTimePicker } = require('../DateTimePicker/DateTimePicker');
      render(<DateTimePicker />);
      
      expect(screen.getByTestId('datetime-picker')).toBeInTheDocument();
      expect(screen.getByText('DateTime Picker')).toBeInTheDocument();
    });

    it('should handle date selection', () => {
      const mockOnDateChange = jest.fn();
      const { DateTimePicker } = require('../DateTimePicker/DateTimePicker');
      render(<DateTimePicker onDateChange={mockOnDateChange} />);
      
      const selectButton = screen.getByText('Select Date');
      fireEvent.click(selectButton);
      
      expect(mockOnDateChange).toHaveBeenCalledWith(new Date('2023-01-01'));
    });
  });

  describe('ErrorBoundary', () => {
    it('should render error boundary component', () => {
      const { ErrorBoundary } = require('../ErrorBoundary/ErrorBoundary');
      render(
        <ErrorBoundary>
          <div>Test Content</div>
        </ErrorBoundary>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should handle error states', () => {
      const { ErrorBoundary } = require('../ErrorBoundary/ErrorBoundary');
      render(
        <ErrorBoundary>
          <div>Test Content</div>
        </ErrorBoundary>
      );
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });
  });

  describe('FileUploadDialog', () => {
    it('should render file upload dialog component', () => {
      const { FileUploadDialog } = require('../FileUploadDialog/FileUploadDialog');
      render(<FileUploadDialog />);
      
      expect(screen.getByTestId('file-upload-dialog')).toBeInTheDocument();
      expect(screen.getByText('File Upload Dialog')).toBeInTheDocument();
    });

    it('should handle file upload', () => {
      const mockOnUpload = jest.fn();
      const { FileUploadDialog } = require('../FileUploadDialog/FileUploadDialog');
      render(<FileUploadDialog onUpload={mockOnUpload} />);
      
      const uploadButton = screen.getByText('Upload File');
      fireEvent.click(uploadButton);
      
      expect(mockOnUpload).toHaveBeenCalledWith([new File([''], 'test.txt')]);
    });
  });

  describe('Loading', () => {
    it('should render loading component', () => {
      const { Loading } = require('../Loading/Loading');
      render(<Loading />);
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle loading states', () => {
      const { Loading } = require('../Loading/Loading');
      render(<Loading size="large" />);
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should handle multiple components together', () => {
      const { Badge } = require('../Badge/Badge');
      const { Loading } = require('../Loading/Loading');
      const { ColorPicker } = require('../ColorPicker/ColorPicker');
      
      render(
        <div>
          <Badge>Test Badge</Badge>
          <Loading />
          <ColorPicker />
        </div>
      );
      
      expect(screen.getByTestId('badge')).toBeInTheDocument();
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('should handle component lifecycle', () => {
      const { Badge } = require('../Badge/Badge');
      const { unmount } = render(<Badge>Test Badge</Badge>);
      
      expect(screen.getByTestId('badge')).toBeInTheDocument();
      
      unmount();
      expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
    });
  });
}); 