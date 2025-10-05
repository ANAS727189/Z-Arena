; ModuleID = 'compiler'
source_filename = "compiler"

@n = global double 0.000000e+00
@i = global double 0.000000e+00
@str.6 = internal constant [29 x i8] c"Fibonacci sequence up to 7:\0A\00"
@fmt.10 = internal constant [6 x i8] c"%.2f\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define double @fib(double %n) {
entry0:
  %n1 = alloca double, align 8
  store double %n, double* %n1, align 8
  %n2 = load double, double* %n1, align 8
  %letmp = fcmp ole double %n2, 1.000000e+00
  %booltmp = uitofp i1 %letmp to double
  %cmp4 = fcmp one double %booltmp, 0.000000e+00
  br i1 %cmp4, label %then1, label %else2

then1:                                            ; preds = %entry0
  %n3 = load double, double* %n1, align 8
  ret double %n3

else2:                                            ; preds = %entry0
  %n4 = load double, double* %n1, align 8
  %subtmp = fsub double %n4, 1.000000e+00
  %calltmp = call double @fib(double %subtmp)
  %n5 = load double, double* %n1, align 8
  %subtmp6 = fsub double %n5, 2.000000e+00
  %calltmp7 = call double @fib(double %subtmp6)
  %addtmp = fadd double %calltmp, %calltmp7
  ret double %addtmp

ifcont3:                                          ; No predecessors!
}

define i32 @main() {
entry5:
  %n = alloca double, align 8
  store double 7.000000e+00, double* %n, align 8
  %i = alloca double, align 8
  store double 0.000000e+00, double* %i, align 8
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @str.6, i32 0, i32 0))
  br label %while_cond7

while_cond7:                                      ; preds = %while_body8, %entry5
  %i1 = load double, double* %i, align 8
  %n2 = load double, double* %n, align 8
  %lttmp = fcmp olt double %i1, %n2
  %booltmp = uitofp i1 %lttmp to double
  %whilecond = fcmp one double %booltmp, 0.000000e+00
  br i1 %whilecond, label %while_body8, label %while_cont9

while_body8:                                      ; preds = %while_cond7
  %i3 = load double, double* %i, align 8
  %calltmp = call double @fib(double %i3)
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @fmt.10, i32 0, i32 0), double %calltmp)
  %i4 = load double, double* %i, align 8
  %addtmp = fadd double %i4, 1.000000e+00
  store double %addtmp, double* %i, align 8
  br label %while_cond7

while_cont9:                                      ; preds = %while_cond7
  ret i32 0
}
