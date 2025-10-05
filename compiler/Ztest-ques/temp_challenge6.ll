; ModuleID = 'compiler'
source_filename = "compiler"

@n = global double 0.000000e+00
@fact = global double 0.000000e+00
@i = global double 0.000000e+00
@str.4 = internal constant [16 x i8] c"Factorial is: \0A\00"
@fmt.5 = internal constant [6 x i8] c"%.2f\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define i32 @main() {
entry0:
  %n = alloca double, align 8
  store double 5.000000e+00, double* %n, align 8
  %fact = alloca double, align 8
  store double 1.000000e+00, double* %fact, align 8
  %i = alloca double, align 8
  store double 1.000000e+00, double* %i, align 8
  br label %while_cond1

while_cond1:                                      ; preds = %while_body2, %entry0
  %i1 = load double, double* %i, align 8
  %n2 = load double, double* %n, align 8
  %letmp = fcmp ole double %i1, %n2
  %booltmp = uitofp i1 %letmp to double
  %whilecond = fcmp one double %booltmp, 0.000000e+00
  br i1 %whilecond, label %while_body2, label %while_cont3

while_body2:                                      ; preds = %while_cond1
  %fact3 = load double, double* %fact, align 8
  %i4 = load double, double* %i, align 8
  %multmp = fmul double %fact3, %i4
  store double %multmp, double* %fact, align 8
  %i5 = load double, double* %i, align 8
  %addtmp = fadd double %i5, 1.000000e+00
  store double %addtmp, double* %i, align 8
  br label %while_cond1

while_cont3:                                      ; preds = %while_cond1
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @str.4, i32 0, i32 0))
  %fact6 = load double, double* %fact, align 8
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @fmt.5, i32 0, i32 0), double %fact6)
  ret i32 0
}
