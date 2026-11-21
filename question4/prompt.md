# Question 4 — Prompt Log

> [!NOTE]
> **Prompt**: ข้อความที่พิมพ์ถาม AI (กล่องสีฟ้า)

> [!TIP]
> **Answer**: คำตอบจาก AI (กล่องสีเขียว)

## Section 1: Modern Roman Numerals (`toRoman` / `fromRoman`) พร้อม Unit Test

### Prompt

> [!NOTE]
> **Prompt**
>
> ต่อไปเป็นข้อ 4 นะ หลักๆมันคือ Modern Roman Numerals
>
> คิดว่าไม่มีอะไรซับซ้อน นายสามารถ ยืนยัน logic ที่เข้าใจกับเว็บไซต์แหล่งอ้างอิงอันนี้ได้ https://en.wikipedia.org/wiki/Roman_numerals#Standard_form
>
> หลักๆจะให้ ทำสอง function 1.คือรับ int เข้ามาเป็นตัวเลขและแปลงเป็น string ในรูปของโรมัน 2.คือรับเป็น string และแปลงให้เป็น int ตัวเลข
>
> ยังคงต้องทำ prompt.md และ test เหมือนข้อก่อนๆหน้า

### Answer

> [!TIP]
> **Answer**
>
> #### 1. ยืนยัน logic กับ Wikipedia (Standard form)
>
> ข้อมูลจาก [Roman numerals — Standard form](https://en.wikipedia.org/wiki/Roman_numerals#Standard_form):
>
> - **ค่าของสัญลักษณ์:** `I` = 1, `V` = 5, `X` = 10, `L` = 50, `C` = 100, `D` = 500, `M` = 1000
> - **Subtractive form มีแค่ 6 แบบ:** `IV` = 4, `IX` = 9, `XL` = 40, `XC` = 90, `CD` = 400, `CM` = 900 ("These are the only subtractive forms in standard use.")
> - **เขียนทีละหลัก** จากหลักพันลงไปหลักหน่วย หลักที่เป็น 0 ไม่ต้องเขียนอะไร
> - **ค่าสูงสุด** คือ 3,999 (`MMMCMXCIX`) และ **ไม่มีสัญลักษณ์ของ 0**
> - ใช้ `IV` แทน `IIII` และ `IX` แทน `VIIII`
>
> ตารางแต่ละหลัก:
>
> | Digit | Thousands | Hundreds | Tens | Units |
> |---|---|---|---|---|
> | 1 | M | C | X | I |
> | 2 | MM | CC | XX | II |
> | 3 | MMM | CCC | XXX | III |
> | 4 | | CD | XL | IV |
> | 5 | | D | L | V |
> | 6 | | DC | LX | VI |
> | 7 | | DCC | LXX | VII |
> | 8 | | DCCC | LXXX | VIII |
> | 9 | | CM | XC | IX |
>
> ความเข้าใจตรงกับ Wikipedia ทั้งหมด จากตารางนี้แต่ละตัวเลข 1 ถึง 3999 มี standard form ได้ **แบบเดียว** ซึ่งเป็นหลักที่ใช้ตรวจ input ใน `fromRoman`
>
> #### 2. `toRoman(num: number): string`
>
> - ใช้ตารางสัญลักษณ์ 13 ตัว เรียงจากมากไปน้อย รวม subtractive form 6 แบบ (`M`, `CM`, `D`, `CD`, `C`, `XC`, `L`, `XL`, `X`, `IX`, `V`, `IV`, `I`)
> - **Greedy:** ใช้สัญลักษณ์ที่ใหญ่ที่สุดที่ไม่เกินค่าที่เหลือ แล้วลบค่าออก ทำซ้ำจนเหลือ 0
> - ตัวอย่าง `1994`: `M` (เหลือ 994), `CM` (94), `XC` (4), `IV` (0) ได้ `MCMXCIV`
> - ถ้า `num` ไม่ใช่จำนวนเต็ม หรือไม่อยู่ในช่วง 1 ถึง 3999 จะ throw `RangeError`
>
> #### 3. `fromRoman(roman: string): number`
>
> 1. อ่านทีละตัวอักษร ถ้าตัวปัจจุบันน้อยกว่าตัวถัดไปให้ลบ ถ้าไม่ใช่ให้บวก (`XIV` = 10 - 1 + 5 = 14)
> 2. ถ้าเจอตัวอักษรที่ไม่ใช่ `I V X L C D M` จะ throw `Error`
> 3. **ตรวจ standard form:** แปลงผลรวมกลับด้วย `toRoman` แล้วเทียบกับ input ถ้าไม่เท่ากันจะ throw `Error`
>
> ข้อ 3 จำเป็นเพราะขั้นตอนที่ 1 อย่างเดียวรับ input ผิดรูปแบบได้ เช่น `IIII` ได้ 4 และ `IL` ได้ 49 การเทียบกับ `toRoman` ใช้ได้เพราะแต่ละตัวเลขมี standard form แบบเดียว จึงไม่ต้องเขียน regex หรือกฎแยกเอง
>
> ตัวอย่าง input ที่ถูก reject: `IIII`, `VV`, `IL`, `IC`, `XM`, `VX`, `IIX`, `IVI`, `MMMM`, `""`
>
> #### 4. Remark: เคสที่ไม่ได้ Support
>
> 1. **ตัวเลขมากกว่า 3999:** ไม่รองรับ vinculum (ขีดบน เช่น V̅ = 5000)
> 2. **0 และตัวเลขติดลบ:** ไม่รองรับ `N` (nulla)
> 3. **Additive form ในอดีตหรือบนหน้าปัดนาฬิกา:** `IIII` = 4, `VIIII` = 9
> 4. **Subtractive form ที่ไม่ปกติ:** `IIX` = 8, `IC` = 99, `IIC` = 98
> 5. **ตัวพิมพ์เล็ก:** `xiv` ไม่รองรับ รับเฉพาะตัวพิมพ์ใหญ่
> 6. **Whitespace:** ไม่ trim (`" XIV"` ไม่ถูกต้อง)
> 7. **ตัวอักษร Roman numeral ของ Unicode:** เช่น `Ⅻ` (U+216B)
> 8. **เศษส่วน:** `S` = 1/2 และจุดแทน 1/12
>
> #### 5. Unit Test (`question4/romanNumerals.test.ts`)
>
> ใช้ `node:test` + `node:assert/strict` เหมือนข้อก่อน มี 21 tests ใน 4 suites:
>
> 1. **`toRoman`**
>    - ตัวอย่างจาก Wikipedia 15 ตัว (`39`, `246`, `1776`, `1944`, `2026`, `3999` ฯลฯ)
>    - ตารางแต่ละหลัก (หน่วย สิบ ร้อย พัน)
>    - subtractive form 6 แบบ
>    - หลักที่เป็น 0 (`1009` = `MIX`)
>    - ค่าต่ำสุดและสูงสุด
>    - `0`, `-1`, `4000`, `1.5`, `NaN`, `Infinity` throw `RangeError`
> 2. **`fromRoman`**
>    - ตัวอย่างจาก Wikipedia 15 ตัว และ subtractive form 6 แบบ
>    - additive form (`IIII`, `MMMM`), `V` / `L` / `D` ซ้ำ, subtractive form ที่ไม่ปกติ, ลำดับผิด และ string ว่าง ต้อง throw
>    - ตัวอักษรที่ไม่ใช่ Roman numeral ต้อง throw
> 3. **ใช้ทั้งสอง function ร่วมกัน**
>    - แปลงไปและกลับครบทุกตัวเลข 1 ถึง 3999 แล้วได้ค่าเดิม
>    - ทุกตัวเลข 1 ถึง 3999 ได้ Roman numeral ไม่ซ้ำกัน
> 4. **เคสที่ไม่ support (lock พฤติกรรมปัจจุบันไว้):** ตัวพิมพ์เล็ก, whitespace, ตัวอักษร Unicode
>
> #### 6. วิธีรันและผลการรัน
>
> ```bash
> cd question4
> node romanNumerals.ts               # demo
> node --test romanNumerals.test.ts   # unit test
> ```
>
> ```
> MCMXCIV
> 2026
>
> ℹ tests 21
> ℹ suites 4
> ℹ pass 21
> ℹ fail 0
> ```
>
> ตรวจ type ของ `romanNumerals.ts` ด้วย `tsc --strict --noUncheckedIndexedAccess` แล้ว ไม่มี error
