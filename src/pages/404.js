// pages/404.js

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

function Custom404() {
  const router = useRouter();
  const { asPath } = router;


  useEffect(() => {
    // Get the current pathname
    const { asPath } = router;

    // Check if the URL starts with "/@"
    if (asPath.startsWith('/@')) {
      // Extract the username from the URL
      const username = asPath.slice(2);

      // Redirect to the desired page
      router.replace(`/domain/visit/${username}`);
    }
  }, [router]);


  return (
    <div>
      <Alert
  status='warning'
  variant='subtle'
  flexDirection='column'
  alignItems='center'
  justifyContent='center'
  textAlign='center'
  height='200px'
>
  <AlertIcon boxSize='40px' mr={0} />
  <AlertTitle mt={4} mb={1} fontSize='lg'>
  404
  </AlertTitle>
  <AlertDescription maxWidth='sm'>
  <p>The page <code>{asPath}</code> does not exist.</p>
      <Link href="/">
        <a>Go back to the home page</a>
      </Link>
  </AlertDescription>
</Alert>


    </div>
  );
}

export default Custom404;
