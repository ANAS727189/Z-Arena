; ModuleID = 'compiler'
source_filename = "compiler"

@n = global double 0.000000e+00
@str.5 = internal constant [23 x i8] c"Reverse of 12345 is: \0A\00"
@fmt.6 = internal constant [6 x i8] c"%.2f\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define double @reverse(double %n) {
entry0:
  %n1 = alloca double, align 8
  store double %n, double* %n1, align 8
  %rev = alloca double, align 8
  store double 0.000000e+00, double* %rev, align 8
  %n2 = load double, double* %n1, align 8
  %x = alloca double, align 8
  store double %n2, double* %x, align 8
  br label %while_cond1

while_cond1:                                      ; preds = %while_body2, %entry0
  %x3 = load double, double* %x, align 8
  %gttmp = fcmp ogt double %x3, 0.000000e+00
  %booltmp = uitofp i1 %gttmp to double
  %whilecond = fcmp one double %booltmp, 0.000000e+00
  br i1 %whilecond, label %while_body2, label %while_cont3

while_body2:                                      ; preds = %while_cond1
  %x4 = load double, double* %x, align 8
  %modtmp = frem double %x4, 1.000000e+01
  %digit = alloca double, align 8
  store double %modtmp, double* %digit, align 8
  %rev5 = load double, double* %rev, align 8
  %multmp = fmul double %rev5, 1.000000e+01
  %digit6 = load double, double* %digit, align 8
  %addtmp = fadd double %multmp, %digit6
  store double %addtmp, double* %rev, align 8
  %x7 = load double, double* %x, align 8
  %x8 = load double, double* %x, align 8
  %modtmp9 = frem double %x8, 1.000000e+01
  %subtmp = fsub double %x7, %modtmp9
  %divtmp = fdiv double %subtmp, 1.000000e+01
  store double %divtmp, double* %x, align 8
  br label %while_cond1

while_cont3:                                      ; preds = %while_cond1
  %rev10 = load double, double* %rev, align 8
  ret double %rev10
}

define i32 @main() {
entry4:
  %n = alloca double, align 8
  store double 1.234500e+04, double* %n, align 8
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @str.5, i32 0, i32 0))
  %n1 = load double, double* %n, align 8
  %calltmp = call double @reverse(double %n1)
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @fmt.6, i32 0, i32 0), double %calltmp)
  ret i32 0
}
