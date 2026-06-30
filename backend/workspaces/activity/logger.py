from activities.models import Activity
import logging
logger = logging.getLogger("activities")
class ActivityLogger:
    
    @staticmethod
    def log(user, workspace, activity_type, action, message, description=""):
        Activity.objects.create(
            user=user,
            workspace=workspace,
            activity_type=activity_type,
            action=action,
            message=message,
            description=description
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
            activity_type="MEMBER_ADDED",
            action="added",
            message=f"{name} joined the workspace"
        )

    @staticmethod
    def member_removed(actor, workspace, removed_user):
        name = removed_user.email.split("@")[0].capitalize()
        ActivityLogger.log(
            user=removed_user,
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

    

    #--------------------------
    # TASK ASSIGNMENT
    #--------------------------
    @staticmethod
    def task_assigned(actor, workspace, task, assigned_user):
        logger.debug(f"[LOGGER] task_assigned called: actor={actor.id}, workspace={workspace.id}, task={task.id}, assigned_user={assigned_user.id}")
        name = assigned_user.email.split("@")[0].capitalize()
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="TASK_ASSIGNED",
            action="assigned",
            message=f"assigned '{name}' to task '{task.name}'",
            description=f"{actor.email} assigned {name} to task '{task.name}'"
        )
        logger.debug("[LOGGER] Activity row created")

    @staticmethod
    def task_unassigned(actor, workspace, task, unassigned_user):
        name = unassigned_user.email.split("@")[0].capitalize()
        ActivityLogger.log(
            user=actor,
            workspace=workspace,
            activity_type="TASK_UNASSIGNED",
            action="unassigned",
            message=f"unassigned '{name}' from task '{task.name}'",
            description=f"{actor.email} unassigned {name} from task '{task.name}'"
        )
 
   
