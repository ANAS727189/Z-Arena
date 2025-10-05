#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;

// Function definitions
double reverse(double n) {
    double rev;
    double x;
    double digit;
    rev = 0;
    x = n;
    while ((x > 0)) {
        digit = ((int)x % (int)10);
        rev = ((rev * 10) + digit);
        x = ((x - ((int)x % (int)10)) / 10);
    }
    return rev;
}
int main(void) {
    n = 12345;
    printf("Reverse of 12345 is: \n");
    printf("%.2f\n", reverse(n));
    return 0;
}