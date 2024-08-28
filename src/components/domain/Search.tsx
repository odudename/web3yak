import React, { useEffect, useState } from 'react';
import { Input, Box, TableContainer, Table, Tbody, Tr, Td, Divider } from '@chakra-ui/react';
import { CheckDomain } from '../CheckDomain';
import { DOMAIN_PLACEHOLDER, DOMAIN_TLDS } from '../../configuration/Config'
import { useDomainValidation } from '../../hooks/validate';
import useGlobal from '../../hooks/global';
const Search = () => {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [showBox, setShowBox] = useState(false); // Added state to control visibility of Box
  const { isValidDomain, validateDomain } = useDomainValidation();
  const { showToast } = useGlobal();

  const handleInputFocus = () => {
    setShowBox(false); // Hide Box when input field is clicked
  };


  const process_domains = (param: string) => {
    let processedParams = DOMAIN_TLDS.map(tld => {
      let processedParam = param.toLowerCase();
      if (!processedParam.endsWith(`.${tld}`)) {
        processedParam = `${param}.${tld}`;
      }
      return processedParam;
    });
    return processedParams;
  }
  
  
  const fetchData = (param: string) => {



    setValue(param);

     // Check if the last character typed is a dash (-)
     const lastChar = param[param.length - 1];
     if (lastChar === '-'|| lastChar === '.') {
       // Don't trigger validation and setShowBox
       return;
     }


    validateDomain(param);

   // console.log(param + " **** " + value);

    if (isValidDomain) {
     // console.log("*");
     const processedParams = process_domains(param);
    setValue2(processedParams.join(', ')); // Join the processedParams for display (optional)
 
      setShowBox(true); // Show Box when value is updated after 5 seconds of inactivity

    }
    else {
    //  console.log("invalid domain");

      setShowBox(false);
    }
  };

  useEffect(() => {
    if (!isValidDomain && value !== '') {
      showToast("Notice", "Invalid Domain: " + value, "warning");
      setShowBox(false);
    }
  }, [isValidDomain, value, showToast]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <>

                <Input
                  value={value}
                  onChange={(ev) => fetchData(ev.target.value)}
                  placeholder={DOMAIN_PLACEHOLDER}
                  onFocus={handleInputFocus} // Handle onFocus event to hide Box
                  size='lg'
                />

                {showBox && value != '' && (

                  <Box position='relative' padding='2'>

                    <TableContainer>
                      <Table size='md'>

                      <Tbody>
              {process_domains(value).map((processedValue, index) => (
                <Tr key={index}>
                  <Td>{processedValue}</Td>
                  <Td>-</Td>
                  <Td><CheckDomain domain={processedValue} /></Td>
                </Tr>
              ))}
            </Tbody>

                      </Table>
                    </TableContainer>

                    <Divider />

                  </Box>
                )}
              </>
  );
};

export default Search;
