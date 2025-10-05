#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;

// Function definitions
double sumDigits(double n) {
    double sum;
    double x;
    double digit;
    sum = 0;
    x = n;
    while ((x > 0)) {
        digit = ((int)x % (int)10);
        sum = (sum + digit);
        x = ((x - ((int)x % (int)10)) / 10);
    }
    return sum;
}
int main(void) {
    n = 98765;
    printf("Sum of digits of 98765 is: \n");
    printf("%.2f\n", sumDigits(n));
    return 0;
}