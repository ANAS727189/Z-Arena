#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;
double result;
double i;int main(void) {
    n = 5;
    result = 1;
    for (i = n; (i >= 1); i--) {
        result = (result * i);
    }
    printf("Factorial (reverse for loop): \n");
    printf("%.2f\n", result);
    return 0;
}