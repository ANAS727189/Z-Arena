#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double a;
double b;
double quotient;int main(void) {
    a = 20;
    b = 4;
    quotient = (a / b);
    printf("Quotient is: \n");
    printf("%.2f\n", quotient);
    return 0;
}