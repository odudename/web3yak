// src/hooks/useLoadConfig.tsx

import { useEffect, useState } from 'react';
import { loadConfig } from '../configuration/ConfigLoad';

export const useLoadConfig = () => {
  const [config, setConfig] = useState<any>(null);
  const [configLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const loadedConfig = await loadConfig();
        setConfig(loadedConfig);
      } catch (error) {
        console.error("Error loading config:", error);
        setConfig(null);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { config, configLoading };
};
