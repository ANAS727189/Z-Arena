#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double a;
double b;
double sum;int main(void) {
    a = 7;
    b = 5;
    sum = (a + b);
    printf("Sum is: \n");
    printf("%.2f\n", sum);
    return 0;
}