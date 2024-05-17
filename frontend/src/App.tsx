import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import './App.css';
import { Platform, SocialMediaService, VerificationResult } from './services/SocialMedia.service';

function App() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [accountIdentifier, setAccountIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [platformsLoading, setPlatformsLoading] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial platforms
    setPlatformsLoading(true);
    SocialMediaService.fetchPlatforms()
      .then((data) => {
        setPlatforms(data);
        setPlatformsLoading(false);
      })
      .catch((err: any) => {
        setError(err.message);
        setPlatformsLoading(false);
      });

    // Subscribe to platform updates
    const socket = SocialMediaService.subscribeToPlatformUpdates(setPlatforms);

    return () => {
      socket.close();
    };
  }, []);

  const handlePlatformChange = (event: SelectChangeEvent) => {
    setSelectedPlatform(event.target.value as string);
  };

  const handleIdentifierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountIdentifier(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await SocialMediaService.verifyIdentifier(selectedPlatform, accountIdentifier);
      setResult(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="social-media-identity-verifier">
        {platformsLoading ? (
          <CircularProgress />
        ) : (
          <>
            {platforms.length === 0 ? (
              <Alert severity="info" style={{ marginTop: '20px' }}>
                No platforms available
              </Alert>
            ) : (
              <FormControl fullWidth>
                <InputLabel id="platform-select-label">Social Media Platform</InputLabel>
                <Select
                  labelId="platform-select-label"
                  id="platform-select"
                  value={selectedPlatform}
                  label="Social Media Platform"
                  onChange={handlePlatformChange}
                  disabled={platforms.length === 0}
                >
                  {platforms.map((platform) => (
                    <MenuItem key={platform.name} value={platform.name}>
                      {platform.name}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  id="account-identifier"
                  label="Account Identifier"
                  value={accountIdentifier}
                  onChange={handleIdentifierChange}
                  fullWidth
                  style={{ marginTop: '20px' }}
                  disabled={platformsLoading || platforms.length === 0}
                  helperText={`Example: ${platforms.find((platform) => platform.name === selectedPlatform)?.exampleIdentifier}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading || platformsLoading || platforms.length === 0 || !accountIdentifier}
                  style={{ marginTop: '20px' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify'}
                </Button>
              </FormControl>
            )}
          </>
        )}
      </div>
      {result && (
        <Alert severity="success" style={{ marginTop: '20px' }}>
          {result.message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" style={{ marginTop: '20px' }}>
          {error}
        </Alert>
      )}
    </>
  );
}

export default App;
