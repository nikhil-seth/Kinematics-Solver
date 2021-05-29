import sympy as sympy
from sympy.core.singleton import S
from sympy.interactive.printing import init_printing
import os
import numpy as np
import mpmath
init_printing(use_unicode=False, wrap_line=False)
symbolDict = {}
mpmath.mp.dps = 15
mpmath.mp.pretty = True

def round_expr(expr, num_digits):
    return expr.xreplace({n : round(n, num_digits) for n in expr.atoms(sympy.Number)})

def fn(x):
    arr = np.zeros((4,4),dtype=np.object)
    arr[0][0] = sympy.cos(x[1])
    arr[0][1] = -1*sympy.sin(x[1])*sympy.cos(x[3])
    arr[0][2] = sympy.sin(x[1])*sympy.sin(x[3])
    arr[0][3] = x[2]*sympy.cos(x[1])

    arr[1][0] = sympy.sin(x[1])
    arr[1][1] = sympy.cos(x[1])*sympy.cos(x[3])
    arr[1][2] = -1*sympy.cos(x[1])*sympy.sin(x[3])
    arr[1][3] = sympy.sin(x[1])*x[2]

    arr[2][0] = 0
    arr[2][1] = sympy.sin(x[3])
    arr[2][2] = sympy.cos(x[3])
    arr[2][3] = x[0]
    arr[3][3] = 1
    return arr
    
def solve(obj):
    symbolDict.clear()
    for symbol in obj.symbols:
        symbolDict[symbol] = sympy.symbols(symbol)
    arr = []
    for i in range(1,obj.axis+1):
        row = []
        for j in range(1,5):
            try:
                val = float(obj.data[str(i)][str(j)])
                if(j%2==0):
                    row.append(mpmath.radians(val))
                else:
                    row.append(val)
            except:
                row.append(symbolDict[obj.data[str(i)][str(j)]])
        arr.append(row)
    arr = np.array(arr)
    print(arr.shape)
    ans = calculateTransformationMatrix(obj.axis,arr)
    result={}
    for i in range(0,4):
        row = {}
        for j in range(0,4):
            row[j] = str(ans[i][j])
        result[i]=row
    return result
    
def calculateTransformationMatrix(axis,array):
    ans = np.eye(4)
    for i in range(axis):
        ans = np.dot(ans,fn(array[i]))
    ans = sympy.trigsimp(ans)
    ans = round_expr(ans,3)
    return ans
