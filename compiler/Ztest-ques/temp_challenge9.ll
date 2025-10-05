; ModuleID = 'compiler'
source_filename = "compiler"

@n = global double 0.000000e+00
@sum = global double 0.000000e+00
@str.8 = internal constant [36 x i8] c"Sum of even numbers from 1 to 10: \0A\00"
@fmt.9 = internal constant [6 x i8] c"%.2f\0A\00"

declare i32 @printf(i8*, ...)

declare i32 @scanf(i8*, ...)

define i32 @main() {
entry0:
  %n = alloca double, align 8
  store double 1.000000e+01, double* %n, align 8
  %sum = alloca double, align 8
  store double 0.000000e+00, double* %sum, align 8
  %i = alloca double, align 8
  store double 1.000000e+00, double* %i, align 8
  br label %for_cond1

for_cond1:                                        ; preds = %for_incr3, %entry0
  %i1 = load double, double* %i, align 8
  %n2 = load double, double* %n, align 8
  %letmp = fcmp ole double %i1, %n2
  %booltmp = uitofp i1 %letmp to double
  %forcond = fcmp one double %booltmp, 0.000000e+00
  br i1 %forcond, label %for_body2, label %for_cont4

for_body2:                                        ; preds = %for_cond1
  %i3 = load double, double* %i, align 8
  %modtmp = frem double %i3, 2.000000e+00
  %eqtmp = fcmp oeq double %modtmp, 0.000000e+00
  %booltmp4 = uitofp i1 %eqtmp to double
  %cmp7 = fcmp one double %booltmp4, 0.000000e+00
  br i1 %cmp7, label %then5, label %ifcont6

for_incr3:                                        ; preds = %ifcont6
  %oldval = load double, double* %i, align 8
  %inctmp = fadd double %oldval, 1.000000e+00
  store double %inctmp, double* %i, align 8
  br label %for_cond1

for_cont4:                                        ; preds = %for_cond1
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @str.8, i32 0, i32 0))
  %sum7 = load double, double* %sum, align 8
  %1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @fmt.9, i32 0, i32 0), double %sum7)
  ret i32 0

then5:                                            ; preds = %for_body2
  %sum5 = load double, double* %sum, align 8
  %i6 = load double, double* %i, align 8
  %addtmp = fadd double %sum5, %i6
  store double %addtmp, double* %sum, align 8
  br label %ifcont6

ifcont6:                                          ; preds = %then5, %for_body2
  br label %for_incr3
}
