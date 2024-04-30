import React from 'react';

type ProgressProps = {
  bgcolor: string;
  completed: number;
};

const Progress: React.FC<ProgressProps> = ({ bgcolor, completed }) => {
    const containerStyles: React.CSSProperties = {
      height: 20,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 5,
    };
  
    const fillerStyles: React.CSSProperties = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: bgcolor,
      transition: 'width 1s ease-in-out',
      borderRadius: 'inherit',
      textAlign: 'right' as const // Ensuring that the type is exactly as expected by React.CSSProperties
    };
  
    const labelStyles: React.CSSProperties = {
      padding: 5,
      color: 'white',
      fontWeight: 'bold'
    };
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${completed}%`}</span>
        </div>
      </div>
    );
};

export default Progress;
