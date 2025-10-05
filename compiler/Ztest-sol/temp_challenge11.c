#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;
double i;

// Function definitions
double fib(double n) {
    if ((n <= 1)) {
        return n;
    }
    else {
        return (fib((n - 1)) + fib((n - 2)));
    }
}
int main(void) {
    n = 7;
    i = 0;
    printf("Fibonacci sequence up to 7:\n");
    while ((i < n)) {
        printf("%.2f\n", fib(i));
        i = (i + 1);
    }
    return 0;
}