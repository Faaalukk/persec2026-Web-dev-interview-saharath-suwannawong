# Question 5 — Prompt Log

> [!NOTE]
> **Prompt**: ข้อความที่พิมพ์ถาม AI (กล่องสีฟ้า)

> [!TIP]
> **Answer**: คำตอบจาก AI (กล่องสีเขียว)

## Section 1: เรียงตัวเลขแต่ละหลักจากมากไปน้อย พร้อม Unit Test

### Prompt

> [!NOTE]
> **Prompt**
>
> เก่งมาก เอาไป10คะแนน ต่อไป ข้อ 5 นะโบร ข้อนี้ง่ายมาก ทำ function รับค่าเป็น positive int แล้วก็แค่ sort แต่ละตัวให้มันเรียงลำดับจากมากไปน้อย return เป็น int bro
>
> เช่น
>
> 3008 => 8300<br>
> 1989 => 9981<br>
> 2679 => 9762<br>
> 9163 => 9631
>
> อย่าลืมเรื่อง prompt.md , test หละ

### Answer

> [!TIP]
> **Answer**
>
> #### 1. Implementation (`question5/descendingDigits.ts`)
>
> ```ts
> export function sortDigitsDescending(num: number): number {
>   if (!Number.isSafeInteger(num) || num <= 0) {
>     throw new RangeError(`Number must be a positive safe integer: ${num}`)
>   }
>
>   const sorted = String(num).split("").sort().reverse().join("")
>   const result = Number(sorted)
>
>   if (!Number.isSafeInteger(result)) {
>     throw new RangeError(`Result is bigger than Number.MAX_SAFE_INTEGER: ${sorted}`)
>   }
>   return result
> }
> ```
>
> 1. แปลงตัวเลขเป็น string แล้วแยกเป็นตัวอักษรทีละหลัก (`3008` เป็น `["3", "0", "0", "8"]`)
> 2. `sort()` แล้ว `reverse()` ได้ลำดับจากมากไปน้อย (`["8", "3", "0", "0"]`) ใช้ string sort ได้เพราะแต่ละตัวเป็นตัวอักษรเดียว `"0"` ถึง `"9"` ลำดับจึงตรงกับตัวเลข
> 3. `join` แล้วแปลงกลับเป็น number (`8300`)
>
> 0 จะไปอยู่ท้าย จึงไม่หายไป (`3008` เป็น `8300`)
>
> #### 2. Validation
>
> - **Input ต้องเป็นจำนวนเต็มบวก** ที่ไม่เกิน `Number.MAX_SAFE_INTEGER` (9007199254740991) ถ้าไม่ใช่จะ throw `RangeError` เช่น `0`, `-3008`, `12.5`, `NaN`, `Infinity`
> - **ผลลัพธ์ต้องไม่เกิน `Number.MAX_SAFE_INTEGER`** เช่นกัน input บางตัวปลอดภัย แต่ผลลัพธ์เกิน เช่น `1999999999999999` ได้ `9999999999999991` ซึ่ง `number` เก็บค่าให้ตรงไม่ได้ จึง throw `RangeError` แทนการคืนค่าที่ผิด
>
> #### 3. Remark: เคสที่ไม่ได้ Support
>
> 1. **0 และตัวเลขติดลบ:** ไม่ใช่จำนวนเต็มบวก
> 2. **ทศนิยม:** `12.5`
> 3. **ตัวเลขเกิน `Number.MAX_SAFE_INTEGER` หรือ input เป็น `BigInt`**
> 4. **Input เป็น string:** `"3008"` รับเฉพาะ `number`
> 5. **เรียงจากน้อยไปมาก:** ไม่รองรับ
>
> #### 4. Unit Test (`question5/descendingDigits.test.ts`)
>
> ใช้ `node:test` + `node:assert/strict` เหมือนข้อก่อน มี 17 tests ใน 3 suites:
>
> 1. **ตัวอย่างจากโจทย์:** `3008`, `1989`, `2679`, `9163`
> 2. **Input อื่นที่ถูกต้อง:** เลขหลักเดียว, เรียงจากมากไปน้อยอยู่แล้ว, เรียงจากน้อยไปมาก (`123456789`), มี 0 (`10`, `1001`, `90000`), ตัวเลขซ้ำ, ผลลัพธ์เป็น `number`, ตัวเลข 16 หลักที่ผลลัพธ์ยังปลอดภัย
> 3. **Input ไม่ถูกต้อง:** `0`, ติดลบ, ทศนิยม, `NaN`, `Infinity`, เกิน `Number.MAX_SAFE_INTEGER`, ผลลัพธ์เกิน `Number.MAX_SAFE_INTEGER`
>
> #### 5. วิธีรันและผลการรัน
>
> ```bash
> cd question5
> node descendingDigits.ts               # demo
> node --test descendingDigits.test.ts   # unit test
> ```
>
> ```
> 8300
> 9981
>
> ℹ tests 17
> ℹ suites 3
> ℹ pass 17
> ℹ fail 0
> ```
>
> ตรวจ type ของ `descendingDigits.ts` ด้วย `tsc --strict --noUncheckedIndexedAccess` แล้ว ไม่มี error
