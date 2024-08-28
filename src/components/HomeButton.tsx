import { FaHome } from "react-icons/fa";
import { Button } from '@chakra-ui/react'
import Link from "next/link";
interface Props {
    domain: string
  }
function HomeButton(props: Props) {
return (

<Button leftIcon={<FaHome />} colorScheme='teal' variant='outline' size='xs'>
<Link href={`/domain/info/${props.domain}`}>{props.domain}</Link>
</Button>

);
}
export default HomeButton;