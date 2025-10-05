#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;
double fact;
double i;int main(void) {
    n = 5;
    fact = 1;
    i = 1;
    while ((i <= n)) {
        fact = (fact * i);
        i = (i + 1);
    }
    printf("Factorial is: \n");
    printf("%.2f\n", fact);
    return 0;
}