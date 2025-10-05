#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;
double sum;
double i;int main(void) {
    n = 10;
    sum = 0;
    for (i = 1; (i <= n); i++) {
        if ((((int)i % (int)2) == 0)) {
            sum = (sum + i);
        }
    }
    printf("Sum of even numbers from 1 to 10: \n");
    printf("%.2f\n", sum);
    return 0;
}