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
        public static Error GetSuccess = new("تمت العملية بنجاح");

        public static Error AddSuccess = new("تمت الاضافة بنجاح");

        public static Error UpdateSuccess = new("تم التعديل بنجاح");

        public static Error DeleteSuccess = new("تم الحذف بنجاح");

        public static Error TransFailed = new("لقد حدث خطأ");

        public static Error NotFound = new("هذا العنصر غير موجود");

        public static Error InvalidStatus = new("هذه الحالة غير صالحة");

        public static Error InvalidType = new("هذا النوع غير صالح");

        public static Error InvalidCredentials = new("اسم المستخدم او كلمة المرور غير صالح");

        public static Error InvalidBeneFactorCredentials = new("اسم المستخدم او الكود غير صالح");

        public static Error DuplicateEmail = new("البريد الإلكتروني مسجل مسبقاً");

        public static Error SuccessLogin = new("تم تسجيل الدخول بنجاح");

        public static Error SuccessRegister = new("تم تسجيل مستخدم جديد بنجاح");

        public static Error AlreadyExists = new("هذا العنصر موجود بالفعل");

        public static Error ScheduleFull = new("تم الوصول للحد الاقصي للحجز اليوم");

        public static Error ScheduleNotFound = new("لا يوجد ميعاد متاح في هذا الوقت");

        public static Error UserNotFound = new("هذا المستخدم غير موجود");

        public static Error EmailAlreadyExists = new("تم استخدام البريد الإلكتروني بالفعل بواسطة مستخدم آخر");

        public static Error FailedToUpdateEmail = new("فشل في تعديل البريد الإلكتروني");

        public static Error FailedToUpdatePassword = new("فشل في تعديل كلمة المرور");

        public static Error FailedToAssignNewRole = new("فشل في تعيين صلاحية جديدة");

        public static Error ParentAccountNotFound = new("فشل في تعيين صلاحية جديدة");

        public static Error DeletePassFailed = new("فشل في حذف كلمة المرور القديمة");

        public static Error NewPassFailed = new("كلمة المرور الجديدة غير صالحة");

        public static Error UpdateRoleFailed = new("فشل في تحديث صلاحيات المستخدم");

        public static Error ApplySort = new("تم تطبيق الترتيب بنجاح");

        public static Error ChangeStatusSuccess = new("تم تغيير الحالة بنجاح");
    }
}
