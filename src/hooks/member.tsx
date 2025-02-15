import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { isValidMember } from '../hooks/validate';

export enum MemberStatus {
    NOT_CONNECTED,
    GOLD,
    ADMIN
}

export const useMemberStatus = () => {
    const { address, isConnected } = useAccount();
    const [status, setStatus] = useState<MemberStatus>(MemberStatus.NOT_CONNECTED);

    useEffect(() => {
        const fetchMemberStatus = async () => {
            if (!isConnected) {
                setStatus(MemberStatus.NOT_CONNECTED);
                return;
            }

            try {
                const memberStatus = address ? await isValidMember(address) : null;
                if (address === process.env.NEXT_PUBLIC_ADMIN_WALLET) {
                    setStatus(MemberStatus.ADMIN);
                } else if (memberStatus) {
                    setStatus(MemberStatus.GOLD);
                } else {
                    setStatus(MemberStatus.NOT_CONNECTED);
                }
            } catch (error) {
                console.error('Error fetching membership status:', error);
                setStatus(MemberStatus.NOT_CONNECTED);
            }
        };

        fetchMemberStatus();
    }, [address, isConnected]);

    const isMember = status === MemberStatus.GOLD;
    const isAdmin = status === MemberStatus.ADMIN;

    return { isConnected, isMember, isAdmin };
};