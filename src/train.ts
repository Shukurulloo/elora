/* Project Standards:
   - Loggin standards
   - Naming standards:
      function, method, variable => CAMEL
      class => PASCAL
      folder, file => KEBAB
      css => SNAKE
   - Error handling

*/

/*  Request
   Traditional Api
   Rest Api
   GraphQL Api
   ...
*/

/*  Frontend Development
   Traditional Frontend Development FD    => SSR  =  BSSR (Admin)  => EJS
   Modern Frontend Development  FD        => SPA  (Users' application) => REACT (Library)
*/

/* Cookies 
   reqest join: har bir requestga kirvoladi
   self destroy: o'zini o'zi o'chiradi

*/

/* Validation:  datalarni to'g'ri kiritilayotganini tekshiruvchi validationlar 4 xil bo'ladi
   frontend validation       fronenda malumotlarni to'g'ri kiritilayotganini tekshiradi
   Backend validation
   Databace validation


*/

/**
   Authentication => login bo'lganmi yo'qmi? login bo'lgan bo'lsa o'tkaz degani
   Authorization  => login bo'lgan specific(maxsus) userlar ishlatadigon degani yani faqat adminlar qila oladi
 */

/** 
   lips folderidagi utilsni ichida MVC ga dahildor bo'lmagan mantiqlar yozilishi mumkin
   misol uchun uploader.ts rasm yuklash mantig'i
*/

// @ts-ignore typescript ishlamay turadi




/**  ejs sintaks
   <%- %>    => includes,(포함)
   <%= %>    =>  qiymat chaqirish, qabul qilish
   <% %>     => control flow (nazorat oqimi)
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

//   const unlilar: any = ["a", "e", "i", "u", "o"];
//   function countVowels(str : string) {
//    let count: any = 0;
//    for (let harflar of str.toLowerCase()) {
//       if (unlilar.includes(harflar)) {
//       count++;
//       }
//    }
//    return count
// }

// console.log("check:", countVowels("Shukurullo"))
 
/** 
L-TASK: 

Shunday function yozing, u string qabul qilsin va string ichidagi hamma sozlarni chappasiga yozib va sozlar ketma-ketligini buzmasdan stringni qaytarsin.
MASALAN: reverseSentence("we like coding!") return "ew ekil gnidoc";
*/



// function reverseSentence(sentence: string): string {
//    const words: string[] = sentence.split(" ");
//    const reversedWords: string[] = words.map(word => word.split("").reverse().join(""));
//    return reversedWords.join(" ");
// }

// console.log(reverseSentence("we like coding!"));


/** M-TASK: 

Shunday function yozing, u raqamlardan tashkil topgan array qabul qilsin
va array ichidagi har bir raqam uchun raqamni ozi va hamda osha raqamni kvadratidan tashkil topgan object hosil qilib, 
hosil bolgan objectlarni array ichida qaytarsin.
MASALAN: getSquareNumbers([1, 2, 3]) return [{number: 1, square: 1}, {number: 2, square: 4}, {number: 3, square: 9}];
 */

interface SquareObject {
   number: number;
   square: number;
}

function getSquareNumbers(arr: number[]): SquareObject[] {
   return arr.map(num => ({ number: num, square: num * num }));
}

const arr1: number[] = [1, 2, 3];
const squareNumbers: SquareObject[] = getSquareNumbers(arr1);
console.log(squareNumbers);