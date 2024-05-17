import { Box, TextField } from '@mui/material';
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';

interface EditableChipInputProps {
  label: string;
  onAdd: (newLabel: string) => void;
  placeholder?: string;
}

const EditableChipInput: React.FC<EditableChipInputProps> = ({ label, onAdd, placeholder = 'New Identifier' }) => {
  const [inputValue, setInputValue] = useState(label);
  const [inputWidth] = useState('auto');
  const inputRef = useRef<HTMLInputElement>(null);


  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  const handleBlur = () => {
    if (inputValue) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  return (
    <Box
      sx={{
        display: 'inline-block',
        position: 'relative',
        '& .transition': {
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        },
        '& .hidden': {
          opacity: 0,
          transform: 'scale(0.95)',
        },
        '& .visible': {
          opacity: 1,
          transform: 'scale(1)',
        },
      }}
    >
      <TextField
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        variant="outlined"
        size="small"
        placeholder={placeholder}
        inputRef={inputRef}
        className={`transition visible`}
        sx={{
          width: inputWidth, // Adjust width based on input value
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px', // Make the outline rounder
            padding: '0 8px', // Adjust padding to match Chip
          },
          '& .MuiInputBase-input': {
            height: '32px', // Match the height of the chip
            fontSize: '14px',
            padding: '0', // Remove default padding
          },
        }}
      />
    </Box>
  );
};

export default EditableChipInput;
