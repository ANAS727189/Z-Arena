; ModuleID = 'compiler'
source_filename = "compiler"

@x = global double 0.000000e+00
@y = global double 0.000000e+00
@diff = global double 0.000000e+00
@str.1 = internal constant [17 x i8] c"Difference is: \0A\00"
@fmt.2 = internal constant [6 x i8] c"%.2f\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define i32 @main() {
entry0:
  %x = alloca double, align 8
  store double 1.000000e+01, double* %x, align 8
  %y = alloca double, align 8
  store double 3.000000e+00, double* %y, align 8
  %x1 = load double, double* %x, align 8
  %y2 = load double, double* %y, align 8
  %subtmp = fsub double %x1, %y2
  %diff = alloca double, align 8
  store double %subtmp, double* %diff, align 8
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @str.1, i32 0, i32 0))
  %diff3 = load double, double* %diff, align 8
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @fmt.2, i32 0, i32 0), double %diff3)
  ret i32 0
}
