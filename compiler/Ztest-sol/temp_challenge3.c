#include <stdio.h>
#include <stdbool.h>

// Global variable declarations
double a;
double b;
double product;int main(void) {
    a = 4;
    b = 6;
    product = (a * b);
    printf("Product is: \n");
    printf("%.2f\n", product);
    return 0;
}