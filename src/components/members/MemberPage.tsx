import React, { useState, useEffect }    from 'react';
import { useMember }          from '../../context/MemberProvider';
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
    fetchMembers,
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

const query = search.toLowerCase();
const normalizedQuery = (query ?? "").toLowerCase();
const filteredMembers = members.filter((m) =>
  (m.email ?? "").toLowerCase().includes(normalizedQuery) ||
  (m.firstName ?? "").toLowerCase().includes(normalizedQuery) ||
  (m.lastName ?? "").toLowerCase().includes(normalizedQuery)
);

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
  // const userRole = currentWorkspace?.currentUserRole;

const handleSelectMember = (member: Member) => {
  setEmail(member.email);
  setSearch("");
};
 
useEffect(() => {
  if (!currentWorkspace?.id) return;

  fetchMembers();
  fetchInvitations(currentWorkspace.id);
}, [
    currentWorkspace?.id,
    fetchMembers,
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
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Members
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeMembers.length} active members
          </p>
        </div>
        {canInvite && (
          <div className="flex gap-3">

            {/* Member Assignment */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + User Assignment
            </button>

            {/* Invite Member */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              + Invite Member
            </button>

          </div>
        )}
 
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none"
        />
        <select
          value={filters.role}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, role: e.target.value as MemberFilters['role'] }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="all">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

       {search.length > 0 && (
        <div className="mt-2 border rounded-lg bg-white shadow-sm max-h-48 overflow-y-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member: Member) => (
              <div
                key={member.id}
                onClick={() => handleSelectMember(member)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border border-gray-100"
              >
                 <MemberCard
                    key={member.id}
                    member={member}
                    onEdit={() => setEditingMember(member)}
                    canEdit={canInvite}
                  />
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">
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
              className="h-16 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          {error}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">
            No members found
          </p>
          <p className="text-sm mt-1">
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

      {canInvite && pendingInvitations.length > 0 && (
        <div className="mt-10">

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Invitations
            </h2>

            <p className="text-sm text-gray-500 mt-1">
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
                onCancel={cancelInvitation}
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
