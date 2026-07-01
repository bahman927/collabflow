import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { AvatarChip } from '../shared/AvatarChip';
import { useMember } from '../../context/MemberProvider';
import { Member, MemberRole } from '../../types/member';

interface EditMemberModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
}

export function EditMemberModal({
  isOpen,
  member,
  onClose,
}: EditMemberModalProps) {
  const { updateMember, removeMember } = useMember();
  const [role, setRole] = useState<MemberRole>('member');
  const [submitting, setSubmitting] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setRole(member.role);
      setShowRemoveConfirm(false);
      setError(null);
    }
  }, [member]);

  const handleSave = async () => {
    if (!member) return;
    setSubmitting(true);
    setError(null);
    try {
      console.log('in handleSave ', member.id)
      await updateMember(member.id, { role });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update member'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!member) return;
    setSubmitting(true);
    try {
      console.log('in handleRemove ', member.id)
      await removeMember(member.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to remove member'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!member) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${member.displayName}`}
      footer={
        <>
          <button
            onClick={() => setShowRemoveConfirm(true)}
            className="mr-auto px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            Remove
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={role === member.role || submitting}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Member Info (read-only) */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <AvatarChip
            name={member.displayName}
            avatarUrl={member.avatarUrl}
            size="lg"
            showName={false}
          />
          <div>
            <div className="font-medium text-gray-900">
              {member.displayName}
            </div>
            <div className="text-sm text-gray-500">
              {member.email}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Joined{' '}
              {new Date(member.joinedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Role Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Role
          </label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as MemberRole)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <p className="text-xs text-gray-500 mt-1.5">
            {role === 'admin' &&
              'Can manage members, settings, and all content.'}
            {role === 'member' &&
              'Can create, edit, and assign tasks.'}
            {role === 'viewer' &&
              'Read-only access to workspace content.'}
          </p>
        </div>

        {/* Remove Confirmation */}
        {showRemoveConfirm && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              Remove {member.displayName}?
            </p>
            <p className="text-xs text-red-600 mt-1">
              They will lose access to this workspace immediately.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRemove}
                disabled={submitting}
                className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                {submitting ? 'Removing...' : 'Yes, Remove'}
              </button>
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="px-3 py-1.5 text-xs text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
