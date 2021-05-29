from solver import solve
from flask import Flask,render_template
from flask import request
import json
from flask.wrappers import JSONMixin
class dataClass:
    axis = 0 
    symbols=set()
    data={}
obj = dataClass()

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template('index.html')

@app.route("/axisValue",methods=['GET','POST'])
def handleAxisValue():
    if(request.method == 'POST'):
        obj.axis = request.json['value']
    else:
        return {'value':obj.axis}
    return "true"
@app.route("/validateAndStoreData",methods=['POST'])
def validateAndStoreData():
    data = request.get_json(force=True)
    if(validateData(data)):
        obj.data = data
        return {'result':"true"}
    else:
        return {'result':"false"}

@app.route('/process',methods=['GET'])
def process():
    result = solve(obj)
    print("result")
    print(result)
    return {'result':result}

@app.route('/addSymbol',methods=['POST'])
def addSymbol():
    data =request.get_json(force=True)
    obj.symbols.add(data['symbol'])
    print("symbol added:"+data['symbol'])
    return {'result':'true'}

def validateData(data):
    print(data)
    for i in range(1,obj.axis+1):
        for j in range(1,5):
            try:
                float(data[str(i)][str(j)])
            except:
                if(data[str(i)][str(j)] not in obj.symbols):
                    return False
    return True

            