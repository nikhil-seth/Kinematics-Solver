import sympy as sympy
from sympy import *
from sympy.interactive.printing import init_printing
import os
import numpy as np
import mpmath
init_printing(use_unicode=False, wrap_line=False)

def round_expr(expr, num_digits):
    return expr.xreplace({n : round(n, num_digits) for n in expr.atoms(sympy.Number)})

th1,th2,l1,l2 = sympy.symbols('th1 th2 l1 l2')
arr = np.array([[cos(th1+th2),-sin(th1+th2),0,l2*cos(th1+th2)+l1*cos(th1)],
                [sin(th1+th2),cos(th1+th2),0,l1*sin(th1+th2)+l2*sin(th1)],
                [0,0,1,0],
                [0,0,0,1]])
arr = arr.ravel()
arr =arr - np.array([[-0.2924,-0.9563,0,0.6978],[0.9563,-0.2924,0,0.8172],[0,0,1,0],[0,0,0,1]]).ravel()
print(arr)
sol = sympy.solvers.solve(arr,dict=True)
print(sol)