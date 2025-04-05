// src/hooks/ipfs.tsx

import { useState } from 'react';

export async function generateJson(rawjson: any[], name: string): Promise<object | null> {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(rawjson)); // Append JSON data
    formData.append('name', name); // Append name string
    //const url = `http://localhost/blockchain/web3domain_org/endpoint/v1/json.php`;
    const url = `https://web3yak.com/endpoint/v1/json.php`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData, // Use the FormData object
    });

 
   // console.log(response.ok);
    return response;
  } catch (error) {
    console.error('Error generating JSON:', error);
    return null;
  }
}

export async function generateImage(domainName: string, key: string, scan_url: string): Promise<string | null> {
  try {
    const [domain,primary] = domainName.split('@'); // Split domainName into primary and domain
    //const url = `http://localhost/blockchain/api/studio_nft.php?domain=${domain}&primary=${primary}&key=${key}`;
    const url = `https://web3yak.com/endpoint/studio_qr.php?domain=${domain}&primary=${primary}&key=${key}&url=${scan_url}`;
    //http://localhost/blockchain/api/studio_nft.php?domain=hi&primary=0x&key=9&url=0xns.pro
    console.log(url);
    const response = await fetch(url);
    const content = await response.text(); // Get the content as text

    return content;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

export async function generatePreview(rawjson: any[], name: string,generate: string): Promise<object | null> {
  try {
    const formData = new FormData();
    formData.append('data', JSON.stringify(rawjson)); // Append JSON data
    formData.append('name', name); // Append name string
    formData.append('template',"https://web3yak.com/endpoint/template/theme1/index.php");
    formData.append('generate',generate);
   // const url = `http://localhost/blockchain/web3domain_org/endpoint/template/start.php`;
    const url = `https://web3yak.com/endpoint/template/start.php`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData, // Use the FormData object
    });

 console.log(response);
   // console.log(response.ok);
    return response;
  } catch (error) {
    console.error('Error generating JSON:', error);
    return null;
  }
}