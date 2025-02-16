import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { isValidMember } from '../hooks/validate';
import { useLoadConfig } from "../hooks/useLoadConfig";
export enum MemberStatus {
    NOT_CONNECTED,
    GOLD,
    ADMIN
}

export const useMemberStatus = () => {
      const { config, configLoading } = useLoadConfig();
    const { address, isConnected } = useAccount();
    const [status, setStatus] = useState<MemberStatus>(MemberStatus.NOT_CONNECTED);

    useEffect(() => {
        const fetchMemberStatus = async () => {
            if (!isConnected || configLoading) {
                setStatus(MemberStatus.NOT_CONNECTED);
                return;
            }

            try {

                const memberStatus = address ? await isValidMember(address) : null;
                console.log(memberStatus);
                if (address === config.ADMIN_WALLET) {
                    console.log("Admin");
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
    }, [address, isConnected, configLoading]);

    const isMember = status === MemberStatus.GOLD || status === MemberStatus.ADMIN;
    const isAdmin = status === MemberStatus.ADMIN;

    return { isConnected, isMember, isAdmin };
};