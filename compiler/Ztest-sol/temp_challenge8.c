#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;
double result;
double i;int main(void) {
    n = 5;
    result = 1;
    for (i = 1; (i <= n); i++) {
        result = (result * i);
    }
    printf("Factorial using for loop: \n");
    printf("%.2f\n", result);
    return 0;
}