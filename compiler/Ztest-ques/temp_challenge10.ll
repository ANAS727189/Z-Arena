; ModuleID = 'compiler'
source_filename = "compiler"

@n = global double 0.000000e+00
@result = global double 0.000000e+00
@str.5 = internal constant [32 x i8] c"Factorial (reverse for loop): \0A\00"
@fmt.6 = internal constant [6 x i8] c"%.2f\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define i32 @main() {
entry0:
  %n = alloca double, align 8
  store double 5.000000e+00, double* %n, align 8
  %result = alloca double, align 8
  store double 1.000000e+00, double* %result, align 8
  %n1 = load double, double* %n, align 8
  %i = alloca double, align 8
  store double %n1, double* %i, align 8
  br label %for_cond1

for_cond1:                                        ; preds = %for_incr3, %entry0
  %i2 = load double, double* %i, align 8
  %getmp = fcmp oge double %i2, 1.000000e+00
  %booltmp = uitofp i1 %getmp to double
  %forcond = fcmp one double %booltmp, 0.000000e+00
  br i1 %forcond, label %for_body2, label %for_cont4

for_body2:                                        ; preds = %for_cond1
  %result3 = load double, double* %result, align 8
  %i4 = load double, double* %i, align 8
  %multmp = fmul double %result3, %i4
  store double %multmp, double* %result, align 8
  br label %for_incr3

for_incr3:                                        ; preds = %for_body2
  %oldval = load double, double* %i, align 8
  %dectmp = fsub double %oldval, 1.000000e+00
  store double %dectmp, double* %i, align 8
  br label %for_cond1

for_cont4:                                        ; preds = %for_cond1
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @str.5, i32 0, i32 0))
  %result5 = load double, double* %result, align 8
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @fmt.6, i32 0, i32 0), double %result5)
  ret i32 0
}
