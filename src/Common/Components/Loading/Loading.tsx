import * as React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { LoadingProps } from './Loading.types';
import './Loading.scss';

export const Loading: React.FC<LoadingProps> = ({
  size = SpinnerSize.large,
  label = 'Loading...',
  overlay = false,
  className,
  ...props
}) => {
  const content = (
    <div className={`loading-container ${className || ''}`} {...props}>
      <Spinner 
        size={size} 
        label={label}
        className="loading-spinner"
      />
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        {content}
      </div>
    );
  }

  return content;
};
