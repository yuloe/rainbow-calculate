// generate a randomnum range from minNum to maxNum
function RandomNum(minNum, maxNum){
  switch(arguments.length){ 
    case 1: 
        return parseInt(Math.random()*minNum+1,10); 
    case 2: 
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
    default: 
        return 0; 
  }
}

// judge if the divide expression is valid
function JudgeDivide(num1, num2){
  return (num1%num2)?false:true;
}

// generate dividable number
function GenerateDiv()
{
  var num1 = RandomNum(1,81)
  var num2 = RandomNum(1,9)
  while((!JudgeDivide(num1,num2)) || ((num1/num2) >= 10)){
    num1 = RandomNum(1,81)
    num2 = RandomNum(1,9)
  }
  return {
    num1:num1,
    opt:3,
    num2:num2
  }
}

// calculate result
function CalResult(num1,operator,num2){
  switch (operator) {
    case 0:
      return num1+num2
    case 1:
      return num1-num2
    case 2:
      return num1*num2
    case 3:
      return num1/num2
    default:
      return 0
  }
}

// generate mixed calculation formula
function GenerateMixComputing(){
  var num1 = RandomNum(1,100)
  var num2 = RandomNum(1,100)
  var num3 = RandomNum(1,100)
  var operator1 = RandomNum(0,3)
  var operator2 = RandomNum(0,3)
  var priority = 
  [ //       +  -  *  /
    /* + */ [0, 0,-1,-1],
    /* - */ [0, 0,-1,-1],
    /* * */ [1, 1, 0, 0],
    /* / */ [1, 1, 0, 0]
  ]
  if(priority[operator1][operator2] < 0){
    if(operator2 == 3){
      var obj = GenerateDiv()
      var num2 = obj.num1
      var num3 = obj.num2
    }
    else if(operator2 == 2){
      num2 = RandomNum(1,9)
      num3 = RandomNum(1,9)
    }
    return {
      question_type:6,
      expression:String(num1) + OptToString(operator1) + String(num2) + OptToString(operator2) + String(num3) + "=",
      result:CalResult(num1,operator1,CalResult(num2,operator2,num3))
    }
  }
  else{
    if(operator1 == 3 && operator2 == 3){
      var obj = GenerateDiv()
      var num1 = obj.num1
      var num2 = obj.num2
      var midResult = CalResult(num1,operator1,num2)
      while((!JudgeDivide(midResult,num3)) || ((midResult/num3) >= 10)){
        num3 = RandomNum(1,9)
      }
    }
    else if(operator2 == 3){  // if operator2 is ÷ and the priority is no prior than operator1, than operator1 must be X
      num1 = RandomNum(1,9)
      num2 = RandomNum(1,9)
      var midResult = CalResult(num1,operator1,num2)
      while((!JudgeDivide(midResult,num3)) || ((midResult/num3) >= 10)){
        num3 = RandomNum(1,9)
     }
    }
    else if(operator1 == 3){  // opt1 is ÷
      var obj = GenerateDiv()
      var num1 = obj.num1
      var num2 = obj.num2
      if(operator2 == 2 ){  // and opt2 is X
        num3 = RandomNum(1,9)
      }
    }
    else if(operator1 == 2){ // opt1 is X
      num1 = RandomNum(1,9)
      num2 = RandomNum(1,9)
      if(operator2 == 2 ){  // and opt2 is X, make sure only calculate numbers in multiplication table
        while (CalResult(num1, operator1, num2) > 9){
          num1 = RandomNum(1,9)
          num2 = RandomNum(1,9)
        }
        num3 = RandomNum(1,9) 
      }
    }
    return {
      question_type:6,
      expression:String(num1) + OptToString(operator1) + String(num2) + OptToString(operator2) + String(num3) + "=",
      result:CalResult(CalResult(num1,operator1,num2),operator2,num3)
    }
  }
}

// convert operator into string
function OptToString(opt){
  switch (opt) {
    case 0:
      return '+'
    case 1:
      return '-'
    case 2:
      return 'X'
    case 3:
      return '÷'
    default:
      break;
  }
}

// generate a question decided by the type
function GenerateQuestion(type){
  switch (type) {
    case 1: // Add and subtract within 10
      var num1 = RandomNum(0,10)
      var operator = RandomNum(0,1)
      switch (operator) {
        case 0: 
          var num2 = RandomNum(0,10 - num1)
          break
        case 1:
          var num2 = RandomNum(0,num1)
          break
        default:
          break
      }
      break
    case 2: // Add and subtract within 20
      var num1 = RandomNum(10,20)
      var operator = RandomNum(0,1)
      switch (operator) {
        case 0:
          var num2 = RandomNum(0,20 - num1)
          break
        case 1:
          var num2 = RandomNum(0,num1)
          break
        default:
          break
      }
      break
    case 3: // Add and subtract within 100
      var num1 = RandomNum(20,100)
      var operator = RandomNum(0,1)
      switch (operator) {
        case 0:
          var num2 = RandomNum(0,100 - num1)
          break
        case 1:
          var num2 = RandomNum(0,num1)
          break
        default:
          break
      }
      break
    case 4: // Multiplication in the multiplication table
      var num1 = RandomNum(1,9)
      var num2 = RandomNum(1,9)
      var operator = 2
      break
    case 5: // Division within the multiplication table
      var obj = GenerateDiv()
      var num1 = obj.num1
      var operator = obj.opt
      var num2 = obj.num2
      break
    case 6: // Mixed computing
      var question = GenerateMixComputing()
      while(question.result < 0){
        question = GenerateMixComputing()
      }
      return question
    case 7: // Add and subtract within 10000
      var num1 = RandomNum(1,100)
      var operator = RandomNum(0,1)
      switch (operator) {
        case 0:
          var num2 = RandomNum(1,100 - num1)*(10**RandomNum(0,2))
          num1 = num1 *(10**RandomNum(0,2))
         break
        case 1:
          var num2 = RandomNum(0,num1)
          break
        default:
          break
      }
      break
    case 8: // Multiple digits by one digit
      var num1 = RandomNum(0,200)
      var num2 = RandomNum(0,9)
      break
    case 9: // Complex multiplication and division
      var operator = RandomNum(2,3)
      switch (operator) {
        case 2:
          var num1 = RandomNum(10,99)
          var num2 = RandomNum(1,9)*(10**RandomNum(0,1))
          break
        case 3:
          var num1 = RandomNum(12,99)*(10**RandomNum(0,2))
          var num2 = RandomNum(1,9)
          while(!JudgeDivide(num1,num2)){
            num1 = RandomNum(12,99)*(10**RandomNum(0,2))
            num2 = RandomNum(1,9)
          }
          break
        default:
          break
      }
      break
    default:
      window.alert("Error: Expression generate error!\n")
      return
  }
  // generate one operator question according to the data before
  var question = {
    question_type:type,
    expression:String(num1) + OptToString(operator) + String(num2) + "=",
    result:CalResult(num1,operator,num2)
  }
  return question
}

// generate questions according to the mode
function GenerateQuestionByMode(mode){
  return(GenerateQuestion(mode[RandomNum(0,mode.length - 1)]))
}

while(true){
  console.log(GenerateQuestion(6))
}