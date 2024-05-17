import { Button, CircularProgress, Stack, TextField, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import PlatformItem from '../components/PlatformItem/PlatformItem';
import { PlatformWithIdentifiers } from '../services/socialMedia/models';
import { SocialMediaService } from '../services/socialMedia/socialMedia.service';
import darkTheme from '../theme'; // Import the dark theme
import styles from './manage.module.css';

const Manage: React.FC = () => {
  const auth = useAuth();
  const [platforms, setPlatforms] = useState<PlatformWithIdentifiers[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newExampleIdentifier, setNewExampleIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoading(true);
      try {
        const data = await SocialMediaService.fetchPlatformsAndIdentifiers();
        setPlatforms(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  const handleAddPlatform = async () => {
    setLoading(true);
    setError(null);

    try {
      const newPlatformData = await SocialMediaService.addPlatform(newPlatform, newExampleIdentifier);
      setPlatforms([...platforms, newPlatformData]);
      setNewPlatform('');
      setNewExampleIdentifier(''); // Clear the example identifier field
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth!.logout();
  };

  const handleEditName = async (id: string, newName: string) => {
    setLoading(true);
    setError(null);
    try {
      await SocialMediaService.updatePlatformName(id, newName);
      setPlatforms(platforms.map(platform =>
        platform.id === id ? { ...platform, name: newName } : platform
      ));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExample = async (id: string, newExample: string) => {
    setLoading(true);
    setError(null);
    try {
      await SocialMediaService.updatePlatformExample(id, newExample);
      setPlatforms(platforms.map(platform =>
        platform.id === id ? { ...platform, exampleIdentifier: newExample } : platform
      ));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditIdentifier = async (id: string, oldIdentifierId: string, newIdentifier: string) => {
    setLoading(true);
    setError(null);
    try {
      await SocialMediaService.updatePlatformIdentifier(oldIdentifierId, newIdentifier);
      setPlatforms(platforms.map(platform =>
        platform.id === id ? {
          ...platform,
          identifiers: platform.identifiers.map(i => i.id === oldIdentifierId ? {
            ...i,
            identifier: newIdentifier
          } : i)
        } : platform
      ));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, identifierId?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (identifierId) {
        await SocialMediaService.deletePlatformIdentifier(identifierId);
        setPlatforms(platforms.map(platform =>
          platform.id === id ? {
            ...platform,
            identifiers: platform.identifiers.filter(i => i.id !== identifierId)
          } : platform
        ));
      } else {
        await SocialMediaService.deletePlatform(id);
        setPlatforms(platforms.filter(platform => platform.id !== id));
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIdentifier = async (platformId: string, newIdentifier: string) => {
    setLoading(true);
    setError(null);
    try {
      const addedIdentifier = await SocialMediaService.addIdentifier(platformId, newIdentifier);
      setPlatforms(platforms.map(platform =>
        platform.id === platformId ? { ...platform, identifiers: [...platform.identifiers, addedIdentifier] } : platform
      ));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <Button onClick={handleLogout} variant="contained" color="secondary">
          Logout
        </Button>

        <div className={styles.socialMediaManagementContainer}>
          <h1>Social Media Management</h1>
          <div className={styles.socialMediaListContainer}>
            <Stack spacing={1} sx={{ width: '100%' }}>
              {platforms.map((platform) => (
                <PlatformItem
                  key={platform.id}
                  id={platform.id}
                  label={platform.name}
                  example={platform.exampleIdentifier}
                  identifiers={platform.identifiers}
                  onEditName={handleEditName}
                  onEditExample={handleEditExample}
                  onEditIdentifier={handleEditIdentifier}
                  onDelete={handleDelete}
                  onAddIdentifier={handleAddIdentifier}
                />
              ))}
            </Stack>
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div className={styles.addSocialMediaContainer}>
            <TextField
              label="New Platform"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              fullWidth
            />
            <TextField
              label="New Example Identifier"
              value={newExampleIdentifier}
              onChange={(e) => setNewExampleIdentifier(e.target.value)}
              fullWidth
            />
            <div>
              <Button
                fullWidth={true}
                onClick={handleAddPlatform}
                variant="contained"
                color="primary"
                disabled={loading || !newPlatform || !newExampleIdentifier}
                size='small'
              >
                {loading ? <CircularProgress size={24} /> : 'Add Platform'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Manage;
