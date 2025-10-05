#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double a;
double b;
double remainder;int main(void) {
    a = 15;
    b = 4;
    remainder = ((int)a % (int)b);
    printf("Remainder is: \n");
    printf("%.2f\n", remainder);
    return 0;
}