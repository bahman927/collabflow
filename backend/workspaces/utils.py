from workspaces.models import WorkspaceMember

def ensure_member_role(workspace, user):
    membership, created = WorkspaceMember.objects.get_or_create(
        workspace=workspace,
        user=user,
        defaults={"role": "Member"}
    )

    # Upgrade Viewer → Member
    if membership.role == "Viewer":
        membership.role = "Member"
        membership.save()

    return membership
