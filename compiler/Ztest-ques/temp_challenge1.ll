; ModuleID = 'compiler'
source_filename = "compiler"

@a = global double 0.000000e+00
@b = global double 0.000000e+00
@sum = global double 0.000000e+00
@str.1 = internal constant [10 x i8] c"Sum is: \0A\00"
@fmt.2 = internal constant [6 x i8] c"%.2f\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define i32 @main() {
entry0:
  %a = alloca double, align 8
  store double 7.000000e+00, double* %a, align 8
  %b = alloca double, align 8
  store double 5.000000e+00, double* %b, align 8
  %a1 = load double, double* %a, align 8
  %b2 = load double, double* %b, align 8
  %addtmp = fadd double %a1, %b2
  %sum = alloca double, align 8
  store double %addtmp, double* %sum, align 8
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @str.1, i32 0, i32 0))
  %sum3 = load double, double* %sum, align 8
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @fmt.2, i32 0, i32 0), double %sum3)
  ret i32 0
}
