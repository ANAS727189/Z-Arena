#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;

// Function definitions
double isPrime(double n) {
    double i;
    if ((n <= 1)) {
        return 0.0;
    }
    i = 2;
    while (((i * i) <= n)) {
        if ((((int)n % (int)i) == 0)) {
            return 0.0;
        }
        i = (i + 1);
    }
    return 1.0;
}
int main(void) {
    n = 11;
    if (isPrime(n)) {
        printf("11 is prime\n");
    }
    else {
        printf("11 is not prime\n");
    }
    return 0;
}