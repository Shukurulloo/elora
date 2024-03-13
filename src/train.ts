/* Project Standards:
   - Loggin standards
   - Naming standards:
      function, method, variable => CAMEL
      class => PASCAL
      folder, file => KEBAB
      css => SNAKE
   - Error handling

*/

/* 
   Traditional Api
   Rest Api
   GraphQL Api
   ...
*/

/* 
   Traditional Frontend Development FD    => SSR  =  BSSR (Admin)  => EJS
   Modern Frontend Development  FD        => SPA  (Users' application) => REACT (Library)
*/

/* 
   reqest join: har bir requestga kirvoladi
   self destroy: o'zini o'zi o'chiradi

*/















/*G-TASK: 

Shunday function tuzingki unga integerlardan iborat array pass bolsin
va function bizga osha arrayning eng katta qiymatiga tegishli birinchi indexni qaytarsin.
MASALAN: getHighestIndex([5, 21, 12, 21, 8]) return qiladi 1 sonini.

*/


// function getHighestIndex(arr: number[]): number {
//     if (arr.length === 0) {
//       return -1;
//     }
  
//     let maxIndex = 0;
//     let maxValue = arr[0]; 
  
//     for (let i = 1; i < arr.length; i++) {
//       if (arr[i] > maxValue) {
//         maxValue = arr[i];
//         maxIndex = i;
//       }
//     }
  
//     return maxIndex;
//   }
  
//   console.log(getHighestIndex([5, 0, 12, 20, 84])); 
  
//   console.log("test"); 
  




/*H-TASK: 

shunday function tuzing, u integerlardan iborat arrayni argument sifatida qabul qilib, 
faqat positive qiymatlarni olib string holatda return qilsin
MASALAN: getPositive([1, -4, 2]) return qiladi "12"

*/

// function getPositive(arr: number[]): string {
//    const musbatRaqam: string[] = arr
//    .filter(num => num > 0).map(num => num.toString());

//    return musbatRaqam.join("");
// }

// const result: string = getPositive([1, -4, 2, -55, 1]);
// console.log(result);





/* 
I-TASK: 

Shunday function tuzing, unga string argument pass bolsin. Function ushbu agrumentdagi digitlarni yangi stringda return qilsin
MASALAN: getDigits("m14i1t") return qiladi "141"
*/


// function getDigits(a: string): string {
// let result: string = "";

// for (let num of a) {
//    if (!isNaN(parseInt(num))) {
//    result += num;
//       }
//    } 

// return result;

// }

// console.log("check:", getDigits("1-number aniqlandi 022"));
// console.log("check2:", getDigits("m14i1t"));




/** J-TASK: 

Shunday function yozing, u string qabul qilsin va string ichidagi eng uzun sozni qaytarsin.
MASALAN: findLongestWord("I come from Uzbekistan") return "Uzbekistan"
*/

// function findLongestWord(a: string): string  {
//    const words: string[]= a.split(" "); 
//    return words.sort((a, b) => b.length - a.length)[0]; 
//    } 
    
    
//    console.log(findLongestWord("I come from Uzbekistan"));


/** K-TASK: 

Shunday function yozing, u string qabul qilsin va string ichidagi unli harflar sonini qaytarsin.
MASALAN: countVowels("string") return 1;
*/

  const unlilar: any = ["a", "e", "i", "u", "o"];
  function countVowels(str : string) {
   let count: any = 0;
   for (let harflar of str.toLowerCase()) {
      if (unlilar.includes(harflar)) {
      count++;
      }
   }
   return count
}

console.log("check:", countVowels("Shukurullo"))
 