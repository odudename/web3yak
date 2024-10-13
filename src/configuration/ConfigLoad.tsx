export async function loadConfig() {
    const newConfig = document.cookie
      .split('; ')
      .find((row) => row.startsWith('newConfig='))
      ?.split('=')[1];
  
    try {
      if (newConfig) {
        const config = await import(`./${newConfig}`);
        return config;
      }
    } catch (error) {
      console.warn(`Configuration file for ${newConfig} not found, falling back to default.`);
    }
  
    // Fallback to default configuration if no cookie or file is found
    const defaultConfig = await import('./Config');
    return defaultConfig;
  }
  