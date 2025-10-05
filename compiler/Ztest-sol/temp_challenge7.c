#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double n;
double sum;
double i;int main(void) {
    n = 7;
    sum = 0;
    i = 1;
    while ((i <= n)) {
        sum = (sum + i);
        i = (i + 1);
    }
    printf("Sum from 1 to 7 is: \n");
    printf("%.2f\n", sum);
    return 0;
}