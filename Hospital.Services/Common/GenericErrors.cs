using Hospital.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Services.Common
{
    public class GenericErrors
    {
        public static Error GetSuccess = new("Operation completed successfully");

        public static Error AddSuccess = new("Added successfully");

        public static Error UpdateSuccess = new("Updated successfully");

        public static Error DeleteSuccess = new("Deleted successfully");

        public static Error TransFailed = new("An error has occurred");

        public static Error NotFound = new("This item was not found");

        public static Error InvalidStatus = new("Invalid status");

        public static Error InvalidType = new("Invalid type");

        public static Error InvalidCredentials = new("Invalid username or password");

        public static Error DuplicateEmail = new("Email is already registered");

        public static Error SuccessLogin = new("Login successful");

        public static Error SuccessRegister = new("User registered successfully");

        public static Error AlreadyExists = new("This item already exists");

        public static Error ScheduleFull = new("The booking limit for today has been reached");

        public static Error ScheduleNotFound = new("No available schedule at this time");

        public static Error UserNotFound = new("User not found");

        public static Error EmailAlreadyExists = new("Email is already used by another user");

        public static Error FailedToUpdateEmail = new("Failed to update email");

        public static Error FailedToUpdatePassword = new("Failed to update password");

        public static Error FailedToAssignNewRole = new("Failed to assign new role");

        public static Error ParentAccountNotFound = new("Parent account not found");

        public static Error DeletePassFailed = new("Failed to delete old password");

        public static Error NewPassFailed = new("Invalid new password");

        public static Error UpdateRoleFailed = new("Failed to update user roles");

        public static Error ApplySort = new("Sorting applied successfully");

        public static Error ChangeStatusSuccess = new("Status changed successfully");

        public static Error AdmissionExist = new("This patient already has an admission on this date");
    }
}
