import { useEffect, useState } from 'react';
import { loadConfig } from '../configuration/ConfigLoad';

export const useLoadConfig = () => {
  const [config, setConfig] = useState<any>(null);
  const [configLoading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      const loadedConfig = await loadConfig();
      setConfig(loadedConfig);
      setLoading(false);
    }

    fetchConfig();
  }, []);

  return { config, configLoading };
};
