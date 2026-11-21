function isValid(s: string): boolean {
  const ruleMap = new Map<string,string>()

  ruleMap.set('(',')')
  ruleMap.set('[',']')
  ruleMap.set('{','}')

  const bracket: string[] = []

  for (let i = 0 ; i < s.length ; i ++){
    if(!ruleMap.has(s[i])&& bracket[bracket.length-1] !== s[i]){
      return false
    }

    if(ruleMap.has(s[i])){
      bracket.push(ruleMap.get(s[i])!)
    }

    if(s[i] === bracket[bracket.length-1]){
      bracket.pop()
    }
  }

  if (bracket.length === 0){
    return true
  }

  return false
}
  

console.log(isValid("()"))
console.log(isValid("([]]"))
console.log(isValid("([{}])"))
console.log(isValid("([[{}]]]"))
console.log(isValid(")"))
console.log(isValid("(]}])"))
console.log(isValid("([)]"))
console.log(isValid("{"))