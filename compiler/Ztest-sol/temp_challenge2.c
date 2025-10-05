#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double x;
double y;
double diff;int main(void) {
    x = 10;
    y = 3;
    diff = (x - y);
    printf("Difference is: \n");
    printf("%.2f\n", diff);
    return 0;
}