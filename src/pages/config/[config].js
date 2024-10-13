import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ConfigPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [newConfig, setNewConfig] = useState(null);
  const { config } = router.query;
  useEffect(() => {
    const handleCreateFile = async () => {
      
        console.log(config);
      if (config) {
        try {
          const response = await axios.get(`/api/create-config?config=${config}`);
          setMessage(response.data.message);
          if (response.data.message === "File created successfully") {
            setNewConfig(config);
           
            // Set the cookie using document.cookie
            document.cookie = `newConfig=${config}; path=/; max-age=3600`; // Cookie lasts for 1 hour

          }
        } catch (error) {
          console.error("Error creating file:", error);
          setMessage('No Online Configuration file found.');
        }
      }
    };

    handleCreateFile();
  }, [config]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default ConfigPage;