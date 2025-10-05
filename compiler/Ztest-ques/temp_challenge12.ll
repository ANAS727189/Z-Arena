; ModuleID = 'compiler'
source_filename = "compiler"

@n = global double 0.000000e+00
@str.15 = internal constant [13 x i8] c"11 is prime\0A\00"
@str.16 = internal constant [17 x i8] c"11 is not prime\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define double @isPrime(double %n) {
entry0:
  %n1 = alloca double, align 8
  store double %n, double* %n1, align 8
  %n2 = load double, double* %n1, align 8
  %letmp = fcmp ole double %n2, 1.000000e+00
  %booltmp = uitofp i1 %letmp to double
  %cmp3 = fcmp one double %booltmp, 0.000000e+00
  br i1 %cmp3, label %then1, label %ifcont2

then1:                                            ; preds = %entry0
  ret double 0.000000e+00

ifcont2:                                          ; preds = %entry0
  %i = alloca double, align 8
  store double 2.000000e+00, double* %i, align 8
  br label %while_cond4

while_cond4:                                      ; preds = %ifcont8, %ifcont2
  %i3 = load double, double* %i, align 8
  %i4 = load double, double* %i, align 8
  %multmp = fmul double %i3, %i4
  %n5 = load double, double* %n1, align 8
  %letmp6 = fcmp ole double %multmp, %n5
  %booltmp7 = uitofp i1 %letmp6 to double
  %whilecond = fcmp one double %booltmp7, 0.000000e+00
  br i1 %whilecond, label %while_body5, label %while_cont6

while_body5:                                      ; preds = %while_cond4
  %n8 = load double, double* %n1, align 8
  %i9 = load double, double* %i, align 8
  %modtmp = frem double %n8, %i9
  %eqtmp = fcmp oeq double %modtmp, 0.000000e+00
  %booltmp10 = uitofp i1 %eqtmp to double
  %cmp9 = fcmp one double %booltmp10, 0.000000e+00
  br i1 %cmp9, label %then7, label %ifcont8

while_cont6:                                      ; preds = %while_cond4
  ret double 1.000000e+00

then7:                                            ; preds = %while_body5
  ret double 0.000000e+00

ifcont8:                                          ; preds = %while_body5
  %i11 = load double, double* %i, align 8
  %addtmp = fadd double %i11, 1.000000e+00
  store double %addtmp, double* %i, align 8
  br label %while_cond4
}

define i32 @main() {
entry10:
  %n = alloca double, align 8
  store double 1.100000e+01, double* %n, align 8
  %n1 = load double, double* %n, align 8
  %calltmp = call double @isPrime(double %n1)
  %cmp14 = fcmp one double %calltmp, 0.000000e+00
  br i1 %cmp14, label %then11, label %else12

then11:                                           ; preds = %entry10
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @str.15, i32 0, i32 0))
  br label %ifcont13

else12:                                           ; preds = %entry10
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @str.16, i32 0, i32 0))
  br label %ifcont13

ifcont13:                                         ; preds = %else12, %then11
  ret i32 0
}
