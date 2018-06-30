// CHARLENGTH
function nameShortener(str) {
  let wordLength = str.split('').length;
  let newWord = str;
  if (wordLength > 15) {
    newWord = str.split('').splice('0,15')
  }

  return newWord;
}

export default BasicFunctions;