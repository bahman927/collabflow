import React, { useState, useEffect }    from 'react';
import { useMember }          from '../../context/MemberProvider';
import { useActivity }          from '../../context/ActivityProvider';
import { useAuth }            from '../../hooks/useAuth';
import { useWorkspace }       from '../../context/WorkspaceProvider';
import { MemberCard }         from './MemberCard';
import  AssignUserModal        from './AssignUserModal';
import  InviteMemberModal     from './InviteMemberModal';
import { useInvitations } from '../../context/InvitationProvider';
import { PendingInvitation } from './PendingInvitation';
import { EditMemberModal }    from './EditMemberModal';
import { Member, MemberFilters } from '../../types/member';
 
export function MembersPage() {
  const { user } = useAuth();
  const {
    members,
    loading,
    error,
    activeMembers,
    inviteMember,
  } = useMember();

  const {
  invitations,
  fetchInvitations,
  resendInvitation,
  cancelInvitation,
} = useInvitations();

  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [filters, setFilters] = useState<MemberFilters>({
  search: '',
  role: 'all',
  status: 'active',
});

const handleCancelInvitation = async (invitationId: number) => {
  await cancelInvitation(invitationId);
  await fetchActivity();
};

const query = search.toLowerCase();
const normalizedQuery = (query ?? "").toLowerCase();
const { fetchActivity } = useActivity();

const filteredMembers = members.filter((m) => {
  const matchesSearch =
    (m.email ?? "").toLowerCase().includes(normalizedQuery) ||
    (m.firstName ?? "").toLowerCase().includes(normalizedQuery) ||
    (m.lastName ?? "").toLowerCase().includes(normalizedQuery);

  const matchesRole =
    filters.role=== "all" ||
    m.role?.toLowerCase() === filters.role.toLowerCase();

  return matchesSearch && matchesRole;
});
 

const workspaceMembers = members.map((m) => ({
  id: m.id,
  name: m.displayName,
  avatar: m.avatarUrl ?? undefined,
  role: m.role
}));
 
  const { currentWorkspace }              = useWorkspace();
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showInviteModal, setShowInviteModal]   = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

const handleSelectMember = (member: Member) => {
  setEmail(member.email);
  setSearch("");
};
 
useEffect(() => {
  if (!currentWorkspace?.id) return;

  fetchInvitations(currentWorkspace.id);
}, [
    currentWorkspace?.id,
    fetchInvitations,
   ]);


  // Find current user's membership to get their role
 const currentMembership = members.find((m) => m.userId === user?.id.toString());
 

 const isOwner = currentMembership?.role?.toLowerCase() === "owner";

 const canInvite = currentMembership?.role?.toLowerCase() === 'owner' ||
                   currentMembership?.role?.toLowerCase() === 'admin';

 const pendingInvitations = invitations.filter(
  (invitation) =>
    invitation.workspace === currentWorkspace?.id &&
    (invitation.status ?? "").toLowerCase() === "pending"
);
 return (
  <div className="mx-auto w-full max-w-4xl px-3 py-5 sm:px-6 sm:py-8">

    {/* Header */}
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Members
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {activeMembers.length} active members
        </p>
      </div>

      {canInvite && (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">

          {/* Member Assignment */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto sm:py-2"
          >
            + User Assignment
          </button>

          {/* Invite Member */}
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 sm:w-auto sm:py-2"
          >
            + Invite User
          </button>

        </div>
      )}

    </div>

    {/* Filters Bar */}
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">

      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 sm:py-2"
      />

      <select
        value={filters.role}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            role: e.target.value as MemberFilters['role']
          }))
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm sm:w-auto sm:min-w-36 sm:py-2"
      >
        <option value="all">All Roles</option>
        <option value="owner">Owner</option>
        <option value="member">Member</option>
        <option value="viewer">Viewer</option>
      </select>

    </div>

    {/* Search Results */}
    {search.length > 0 && (
      <div className="mb-6 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-sm">

        {filteredMembers.length > 0 ? (
          filteredMembers.map((member: Member) => (
            <div
              key={member.id}
              onClick={() => handleSelectMember(member)}
              className="cursor-pointer border-b border-gray-100 px-2 py-2 last:border-b-0 hover:bg-gray-100 sm:px-3"
            >
              <MemberCard
                member={member}
                onEdit={() => setEditingMember(member)}
                canEdit={canInvite}
              />
            </div>
          ))
        ) : (
          <div className="px-3 py-3 text-sm text-gray-500">
            No members found
          </div>
        )}

      </div>
    )}

    {/* Member List */}
    {search.length === 0 && (
      loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500 wrap-break-word">
          {error}
        </div>
      ) : members.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-lg font-medium">
            No members found
          </p>

          <p className="mt-1 text-sm">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={() => setEditingMember(member)}
              canEdit={isOwner}
            />
          ))}
        </div>
      )
    )}

    {/* Pending Invitations */}
    {canInvite && pendingInvitations.length > 0 && (
      <div className="mt-8 sm:mt-10">

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Invitations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            These users have been invited but have not
            joined the workspace yet.
          </p>
        </div>

        <div className="space-y-2">
          {pendingInvitations.map((invitation) => (
            <PendingInvitation
              key={invitation.id}
              invitation={invitation}
              onResend={resendInvitation}
              // onCancel={cancelInvitation}
              onCancel={handleCancelInvitation}
            />
          ))}
        </div>

      </div>
    )}

    {/* Modals */}
    <AssignUserModal
      isOpen={showAddModal}
      onClose={() => setShowAddModal(false)}
    />

    <EditMemberModal
      isOpen={!!editingMember}
      member={editingMember}
      onClose={() => setEditingMember(null)}
    />

    <InviteMemberModal
      isOpen={showInviteModal}
      onClose={() => setShowInviteModal(false)}
    />

  </div>
);

}
