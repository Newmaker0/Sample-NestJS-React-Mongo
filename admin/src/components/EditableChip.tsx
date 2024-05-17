import { Box, Chip, TextField } from '@mui/material';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

interface EditableChipProps {
  label: string;
  onDelete?: () => void;
  onEdit?: (newLabel: string) => void;
}

const EditableChip: React.FC<EditableChipProps> = ({ label, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [chipValue, setChipValue] = useState(label);
  const [inputWidth, setInputWidth] = useState('auto');
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      const { scrollWidth } = inputRef.current;
      setInputWidth(scrollWidth + 10 + 'px'); // Adding some padding
    }
  }, [chipValue]);

  const handleChipClick = () => {
    setShowInput(true);
    setTimeout(() => setIsEditing(true), 10); // Add slight delay to allow transition
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChipValue(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setTimeout(() => setShowInput(false), 300); // Delay to allow transition
    if (onEdit && chipValue !== label) {
      onEdit(chipValue);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
      setTimeout(() => setShowInput(false), 300); // Delay to allow transition
      if (onEdit && chipValue !== label) {
        onEdit(chipValue);
      }
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
      {!showInput && (
        <Chip
          label={chipValue}
          onClick={handleChipClick}
          className={`transition ${isEditing ? 'hidden' : 'visible'}`}
          sx={{
            cursor: 'pointer',
          }}
          onDelete={onDelete}
        />
      )}
      {showInput && (
        <TextField
          value={chipValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => setIsEditing(true)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          autoFocus
          inputRef={inputRef}
          className={`transition ${isEditing ? 'visible' : 'hidden'}`}
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
      )}
    </Box>
  );
};

export default EditableChip;
