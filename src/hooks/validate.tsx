// hooks/useDomainValidation.tsx
import { useState } from 'react';
import localforage from 'localforage';

function isValidDomainName(domainName: string): boolean {
  //console.log('Validating : '+domainName);
  const dotCount = domainName.split('.').length - 1;
  if (dotCount > 1) return false;

  return (
    /^[a-z\d]([a-z\d-]*[a-z\d])?(\.[a-z\d]([a-z\d-]*[a-z\d])?)*$/i.test(domainName) &&
    /^.{1,253}$/.test(domainName) &&
    /^[^.]{1,63}(\.[^.]{1,63})*$/.test(domainName)
  );
}

export function useDomainValidation() {
  const [isValidDomain, setIsValidDomain] = useState(true);

  const validateDomain = (domainName: string) => {
    const isValidDomain = isValidDomainName(domainName);
    setIsValidDomain(isValidDomain);
  };

  return {
    isValidDomain,
    validateDomain,
  };
}

// hooks/validate.tsx
export function useURLValidation() {
  const validateURL = (param: string) => {
    if (param != null && param != "") {
      const input = param.toLowerCase(); // Convert input to lowercase

      //console.log("validating URL of: "+input);
      if (input.trim() === '') {
        // Reset validation if input is empty or starts with 'http'
        return true;
      }
      try {
        new URL(input);
        return true;
      } catch (error) {
        return false;
      }
    }
    else {
      return false;
    }
  };

  return { validateURL };
}

export function isValidEthAddress(address: string) {
  if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
    // Doesn't match Ethereum address pattern
    return false;
  }

  // Additional validation can be performed here if needed

  return true;
}

export async function isValidMember(address: string) {
  // Get membership status
  const getMembershipStatus = async (address: string) => {
    return await localforage.getItem(address);
  };

 
  async function getStatus(address:string)
  {
    const membershipStatus = await getMembershipStatus(address);
    //console.log(membershipStatus);
  
    return membershipStatus;
  }
 
  let member=await getStatus(address);
  //console.log(member);
  return member;

}

