interface JsonData {
  records: Record[];
  // Add other properties if needed
}

interface Record {
  type: string;
  value: {
    [key: string]: string;
  };
  // Add other properties if needed
}

interface Value {
  // Define the properties based on the actual structure of the 'value' property
  [key: string]: any;
}

interface Record {
  type: string;
  value: {
    [key: string]: string;
  };
  // Add other properties if needed
}

export function useJsonValue(jsonData: JsonData) {
  const getValue = (domainKey: string) => {
    const cryptoKeys = ["eth", "bsc", "zil", "sol", "matic", "btc", "fil"];
    const socialKeys = ["facebook", "twitter", "telegram", "youtube", "instagram", "discord"];
    const otherKeys = ["notes", "website", "name", "email", "phone", "tg_bot", "web_url", "web3_url"];

    let result: string | any = ''; // Allow any type for the result

    // Check if jsonData and jsonData.records exist and are not null
    if (!jsonData || !jsonData.records) {
      return null; // Return a default value or handle the absence of data
    }

    const recordsArray = Array.isArray(jsonData.records) ? jsonData.records : Object.values(jsonData.records);

    if (cryptoKeys.includes(domainKey)) {
      const cryptoRecord = recordsArray.find(record => (record as Record).type === 'crypto') as Record;
      if (cryptoRecord) {
        const value = cryptoRecord.value[domainKey]; // value[domainKey] can have different types
        result = value !== undefined ? value : result;
      }
    } else if (socialKeys.includes(domainKey)) {
      const socialRecord = recordsArray.find(record => (record as Record).type === 'social') as Record;
      if (socialRecord) {
        const value = socialRecord.value[domainKey]; // value[domainKey] can have different types
        result = value !== undefined ? value : result;
      }
    } else if (otherKeys.includes(domainKey)) {
      const otherRecord = recordsArray.find(record => (record as Record).type === domainKey) as Record;
      if (otherRecord) {
        const value = otherRecord.value; // value can have different types
        result = value !== undefined ? value : result;
      }
    }

    return result;
  };

  return {
    getValue
  };
}

// utils.js

export function getParent(jsonData: JsonData, targetType: string) {
  let parentNumber = null; // Initialize parentNumber to null

  // Iterate through the records in jsonData
  for (const recordNumber in jsonData.records) {
    const record = jsonData.records[recordNumber];

    // Check if the record has a type property and it equals the targetType
    if (record.type === targetType) {
      // If it's a targetType type record, retrieve its parent number
      parentNumber = recordNumber;
      break; // Exit the loop since we found the parent
    }
  }

  // Return the parentNumber, which contains the parent number of the targetType type record
  return parentNumber;
}


    