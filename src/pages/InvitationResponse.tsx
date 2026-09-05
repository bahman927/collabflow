// pages/InvitationResponse.tsx
import { useInvitations } from "../context/InvitationProvider";
import { useActivity } from "../context/ActivityProvider";

interface InvitationResponseProps {
  token: string;
}
export default function InvitationResponse({ token }: InvitationResponseProps ) {
  const { acceptInvite, denyInvite } = useInvitations();
  // const { refreshActivity } = useActivity();
  const activity = useActivity();

  const handleAccept = async () => {
    await acceptInvite(token);
    await activity.fetchActivity();
  };

  const handleDeny = async () => {
    await denyInvite(token);
    await activity.fetchActivity();
  };

  return (
    <div>
      <h2>Invitation to Join CollabFlow</h2>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDeny}>Deny</button>
    </div>
  );
}
