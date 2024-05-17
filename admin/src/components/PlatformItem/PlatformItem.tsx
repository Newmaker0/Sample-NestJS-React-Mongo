import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress, Divider, IconButton, Paper, styled } from '@mui/material';
import React, { useState } from 'react';
import { Identifier } from '../../services/socialMedia/models';
import EditableChip from '../EditableChip';
import EditableChipInput from '../EditableChipInput';
import styles from './PlatformItem.module.css';

interface PlatformItemProps {
  id: string;
  label: string;
  example: string;
  identifiers: Identifier[];
  onEditName: (id: string, newName: string) => Promise<void>;
  onEditExample: (id: string, newExample: string) => Promise<void>;
  onEditIdentifier: (id: string, oldIdentifier: string, newIdentifier: string) => Promise<void>;
  onDelete: (id: string, identifier?: string) => Promise<void>;
  onAddIdentifier: (id: string, newIdentifier: string) => Promise<void>;
}

const StyledItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  minHeight: '40px',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '5px',
  padding: '5px',
}));

const PlatformItem: React.FC<PlatformItemProps> = ({
  id,
  label,
  example,
  identifiers,
  onEditName,
  onEditExample,
  onEditIdentifier,
  onDelete,
  onAddIdentifier,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditName = async (newName: string) => {
    setLoading(true);
    setError(null);
    try {
      await onEditName(id, newName);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExample = async (newExample: string) => {
    setLoading(true);
    setError(null);
    try {
      await onEditExample(id, newExample);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditIdentifier = async (oldIdentifier: string, newIdentifier: string) => {
    setLoading(true);
    setError(null);
    try {
      await onEditIdentifier(id, oldIdentifier, newIdentifier);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (identifierId?: string) => {
    setLoading(true);
    setError(null);
    try {
      await onDelete(id, identifierId);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIdentifier = async (newIdentifier: string) => {
    setLoading(true);
    setError(null);
    try {
      await onAddIdentifier(id, newIdentifier);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledItem>
      {loading && <CircularProgress size={24} />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div id="platform-name" className={styles.chipList}>
        Platform:
        <EditableChip label={label} onEdit={handleEditName} />
      </div>
      <div id="identifier-example" className={styles.chipList}>
        Example:
        <EditableChip label={example} onEdit={handleEditExample} />
      </div>
      <Divider orientation="vertical" flexItem />
      <div id="identifiers" className={styles.chipList}>
        Identifiers:
        {identifiers.length > 0 && (
          identifiers.map((identifier) => (
            <EditableChip
              key={identifier.id}
              label={identifier.identifier}
              onEdit={(newIdentifier) => handleEditIdentifier(identifier.id, newIdentifier)}
              onDelete={() => handleDelete(identifier.id)}
            />
          ))
        )}
        <EditableChipInput label="" onAdd={handleAddIdentifier} placeholder="New Identifier" />
      </div>
      <IconButton onClick={() => handleDelete()} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </StyledItem>
  );
};

export default PlatformItem;
