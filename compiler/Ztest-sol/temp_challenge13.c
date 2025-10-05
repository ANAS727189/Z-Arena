#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double a;
double b;

// Function definitions
double gcd(double a, double b) {
    double temp;
    while ((b != 0)) {
        temp = b;
        b = ((int)a % (int)b);
        a = temp;
    }
    return a;
}
int main(void) {
    a = 48;
    b = 18;
    printf("GCD of 48 and 18 is: \n");
    printf("%.2f\n", gcd(a, b));
    return 0;
}