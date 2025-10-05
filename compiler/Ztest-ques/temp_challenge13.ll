; ModuleID = 'compiler'
source_filename = "compiler"

@a = global double 0.000000e+00
@b = global double 0.000000e+00
@str.5 = internal constant [23 x i8] c"GCD of 48 and 18 is: \0A\00"
@fmt.6 = internal constant [6 x i8] c"%.2f\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define double @gcd(double %a, double %b) {
entry0:
  %a1 = alloca double, align 8
  store double %a, double* %a1, align 8
  %b2 = alloca double, align 8
  store double %b, double* %b2, align 8
  br label %while_cond1

while_cond1:                                      ; preds = %while_body2, %entry0
  %b3 = load double, double* %b2, align 8
  %netmp = fcmp one double %b3, 0.000000e+00
  %booltmp = uitofp i1 %netmp to double
  %whilecond = fcmp one double %booltmp, 0.000000e+00
  br i1 %whilecond, label %while_body2, label %while_cont3

while_body2:                                      ; preds = %while_cond1
  %b4 = load double, double* %b2, align 8
  %temp = alloca double, align 8
  store double %b4, double* %temp, align 8
  %a5 = load double, double* %a1, align 8
  %b6 = load double, double* %b2, align 8
  %modtmp = frem double %a5, %b6
  store double %modtmp, double* %b2, align 8
  %temp7 = load double, double* %temp, align 8
  store double %temp7, double* %a1, align 8
  br label %while_cond1

while_cont3:                                      ; preds = %while_cond1
  %a8 = load double, double* %a1, align 8
  ret double %a8
}

define i32 @main() {
entry4:
  %a = alloca double, align 8
  store double 4.800000e+01, double* %a, align 8
  %b = alloca double, align 8
  store double 1.800000e+01, double* %b, align 8
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @str.5, i32 0, i32 0))
  %a1 = load double, double* %a, align 8
  %b2 = load double, double* %b, align 8
  %calltmp = call double @gcd(double %a1, double %b2)
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @fmt.6, i32 0, i32 0), double %calltmp)
  ret i32 0
}
