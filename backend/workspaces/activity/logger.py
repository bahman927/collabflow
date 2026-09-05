from activities.models import Activity

class ActivityLogger: 
    @staticmethod
    def log(user, workspace, activity_type, action, message):
        Activity.objects.create(
            user=user,
            workspace=workspace,
            activity_type=activity_type,
            action=action,
            message=message,
        )

    @staticmethod
    def member_invited(actor, workspace, email):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="MEMBER_INVITED",
            action="invited",
            message=f"Sent invitation to {email}"
        )    

    # -------------------------
    # MEMBER EVENTS
    # -------------------------
    @staticmethod
    def member_added(actor, workspace, added_user):
        print("added_user : ", added_user)
        name = added_user.email.split("@")[0].capitalize()
        ActivityLogger.log(
            user=added_user,
            workspace=workspace,
            activity_type="MEMBER_INVITED",
            action="invited",
            message=f"invited member '{name}' to workspace"
        )

    @staticmethod
    def member_removed(actor, workspace, removed_user):
        name = removed_user.email.split("@")[0].capitalize()
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="MEMBER_REMOVED",
            action="removed",
            message=f"removed member '{name}' from workspace"
        )

    @staticmethod
    def member_role_changed(actor, workspace, target_user, old_role, new_role):
        name = target_user.email.split("@")[0].capitalize()
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="MEMBER_ROLE_CHANGED",
            action="role changed",
            message=f"changed role of '{name}' from {old_role} to {new_role}"
        )

    @staticmethod
    def member_status_changed(actor, workspace, target_user, new_status):
        name = target_user.email.split("@")[0].capitalize()
        status_text = "activated" if new_status else "deactivated"
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="MEMBER_STATUS_CHANGED",
            action=status_text,
            message=f"{status_text} member '{name}'"
        )

    # -------------------------
    # TASK EVENTS
    # -------------------------
    @staticmethod
    def task_created(actor, workspace, task):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="TASK_CREATED",
            action="created",
            message=f"created task '{task.name}'"
        )
        
    @staticmethod
    def task_completed(actor, workspace, task):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="TASK_COMPLETED",
            action="completed",
            message=f"completed task '{task.title}'"
        )    

    @staticmethod
    def task_updated(actor, workspace, task):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="TASK_UPDATED",
            action="updated",
            message=f"updated task '{task.name}'"
        )

    @staticmethod
    def task_deleted(actor, workspace, task_name):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="TASK_UPDATED",
            action="deleted",
            message=f"deleted task '{task_name}'"
        )    

     #--------------------------
    # TASK ASSIGNMENT
    #--------------------------
    @staticmethod
    def task_assigned(actor, workspace, task, assigned_user):
        name = assigned_user.email.split("@")[0].capitalize()
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="TASK_ASSIGNED",
            action="assigned",
            message=f"assigned task '{task.name}' to '{name}' ",
        )

    @staticmethod
    def task_unassigned(actor, workspace, task, unassigned_user):
        name = unassigned_user.email.split("@")[0].capitalize()
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="TASK_UNASSIGNED",
            action="unassigned",
            message=f"unassigned '{name}' from task '{task.name}'",
        )
 
    @staticmethod
    def task_status_changed(
        actor,
        workspace,
        task,
        old_status,
        new_status
    ):

        Activity.objects.create(
            user=actor,
            workspace=workspace,
            activity_type="TASK_UPDATED",
            action="status_changed",
            message=(
              f"changed the status of task "
              f"'{task.name}' "
              f"from '{old_status}' to '{new_status}'"
            ),
        )
   

    @staticmethod
    def task_renamed(
        actor,
        workspace,
        task,
        old_name,
        new_name,
    ):
        Activity.objects.create(
            user=actor,
            workspace=workspace,
            project=task.project,
            activity_type="TASK_UPDATED",
            action="renamed",
            message=(
                f"renamed task '{old_name}' "
                f"to '{new_name}'"
            ),
        )


    @staticmethod
    def task_description_updated(
        actor,
        workspace,
        task,
    ):
        Activity.objects.create(
            user=actor,
            workspace=workspace,
            project=task.project,
            activity_type="TASK_UPDATED",
            action="description_updated",
            message=(
                f"updated the description "
                f"of task '{task.name}'"
            ),
        )

    # -------------------------
    # PROJECT EVENTS
    # -------------------------

    @staticmethod
    def project_created(actor, workspace, project):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="PROJECT_CREATED",
            action="created",
            message=f"created project '{project.name}'"
        )

    @staticmethod
    def project_updated(actor, workspace, project):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="PROJECT_UPDATED",
            action="updated",
            message=f"updated project '{project.name}'"
        )

    @staticmethod
    def project_deleted(actor, workspace, project_name):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="PROJECT_DELETED",
            action="deleted",
            message=f"deleted project '{project_name}'"
        )

    # -------------------------
    # COMMENT EVENTS
    # -------------------------

    @staticmethod
    def comment_added(actor, workspace, task):
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="COMMENT_ADDED",
            action="commented",
            message=f"commented on task '{task.name}'"
        )

    

   