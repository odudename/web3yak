const updateDatabase = async (movieData) => {
    try {
      // Make a POST request to the updateMovie API route
      const response = await fetch("/api/updateMovie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });
  
      if (response.ok) {
        console.log("Record inserted successfully!");
      } else {
        console.error("Failed to insert record:", await response.text());
      }
    } catch (error) {
      console.error("Error inserting record:", error);
    }
  };
  
  export default updateDatabase;
  