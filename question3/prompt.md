# Question 3 — Prompt Log

> [!NOTE]
> **Prompt**: ข้อความที่พิมพ์ถาม AI (กล่องสีฟ้า)

> [!TIP]
> **Answer**: คำตอบจาก AI (กล่องสีเขียว)

## Section 1: Implement Function `autocomplete` พร้อม Unit Test

### Prompt

> [!NOTE]
> **Prompt**
>
> โอเคต่อไป เริ่มข้อ 3 เลยนะ โจทย์หลักๆคือ การทำ function autocomplete จะมีการรับ parameter 3 ตัว<br>
> a. search เป็น string โดยเป็นคําเอาไว้ค้นหา<br>
> b. items เป็น array string ของคำที่จะเอาไว้ใช้แนะนำ<br>
> c. maxResult คือจำนวนผลลัพท์มากที่สุดที่อยากได้
>
> โดยนำเอา search ไปค้นหาใน items โดย ignore case
>
> ผลลัพท์คือ คำใน items ที่มี search เป็นส่วนนึงของข้อความ โดยมี priority การเรียงลำดับ ตามนี้<br>
> ยกตัวอย่างว่า search = "th"<br>
> 1.คำที่มีคำขึ้นต้นด้วย th เลย เช่น "Think"<br>
> 2.คำที่มีคำ th อยู่ในส่วนกลางๆ เช่น "Mother"<br>
> 3.คำที่มีคำ th อยู่ในส่วนท้าย เช่น "Math"
>
> ยกตัวอย่าง Function
>
> autocomplete(“th”, [“Mother“, “Think”, “Worthy”, “Apple”, “Android”], 2)
>
> จะมี 3 คำที่มี th คือ “Mother“, “Think”, “Worthy”<br>
> เนื่องจาก maxResult มีแค่ 2
>
> ดังนั้นเมื่อเรียงใหม่ตาม priority และผลลัพท์จะได้ [“Think”, “Mother“]
>
> ลอง implement function นี้ให้หน่อยพร้อมทำ test และ prompt.md  เหมือน qusetion2 ให้ที please

### Answer

> [!TIP]
> **Answer**
>
> #### 1. วิเคราะห์โจทย์
>
> หาตำแหน่งแรกที่เจอ `search` ใน item (แปลงเป็นตัวพิมพ์เล็กทั้งคู่ก่อน) แล้วกำหนด priority จากตำแหน่งนั้น:
>
> | Priority | เงื่อนไข | ตัวอย่าง (`search = "th"`) |
> |---|---|---|
> | 1 START | `index === 0` | `Think` |
> | 2 MIDDLE | ไม่ใช่ทั้ง START และ END | `Mother` (index 2), `Worthy` (index 3) |
> | 3 END | `index + search.length === item.length` | `Math` |
>
> ตัวอย่างของโจทย์: `Think` เป็น START ส่วน `Mother` กับ `Worthy` เป็น MIDDLE ทั้งคู่ `Mother` อยู่ก่อนใน input จึงได้ `["Think", "Mother"]` เมื่อ `maxResult = 2`
>
> #### 2. Assumption ที่เลือกใช้ (โจทย์ไม่ได้กำหนด)
>
> 1. **ใช้ตำแหน่งแรกที่เจอเท่านั้น:** `Thoth` ขึ้นต้นและลงท้ายด้วย `th` ถือเป็น START
> 2. **Priority เท่ากันคงลำดับตาม input:** ใช้ stable sort ของ `Array.prototype.sort` (ES2019+)
> 3. **Item ที่เท่ากับ search พอดี** (`TH` กับ `th`) ถือเป็น START
> 4. **คืนค่าตัวพิมพ์เดิม** ของ item ไม่แปลงเป็นตัวพิมพ์เล็ก
> 5. **`search` เป็น string ว่าง หรือ `maxResult <= 0`** คืน `[]` ถ้าไม่เช็ก `slice(0, -1)` จะตัดตัวสุดท้ายออกแทนที่จะคืน `[]`
>
> #### 3. Implementation (`question3/autocomplete.ts`)
>
> ```ts
> export function autocomplete(search: string, items: string[], maxResult: number): string[] {
>   if (search === "" || maxResult <= 0) {
>     return []
>   }
>
>   const keyword = search.toLowerCase()
>
>   const matches: { item: string; priority: Priority }[] = []
>   for (const item of items) {
>     const index = item.toLowerCase().indexOf(keyword)
>     if (index === -1) continue
>     matches.push({ item, priority: getPriority(index, item.length, keyword.length) })
>   }
>
>   matches.sort((a, b) => a.priority - b.priority)
>
>   return matches.slice(0, maxResult).map((match) => match.item)
> }
> ```
>
> - วน `items` รอบเดียว หา index ด้วย `indexOf` แล้วเก็บเฉพาะตัวที่ match
> - sort เฉพาะตัวที่ match ตาม priority แล้วตัดด้วย `maxResult`
> - Priority ใช้ object ธรรมดา (`as const`) แทน `enum` เพราะ Node type stripping ไม่รองรับ `enum`
> - ไม่แก้ `items` เดิม
>
> #### 4. Remark: เคสที่ไม่ได้ Support
>
> 1. **ขอบเขตของคำในวลี:** `New York` กับ `search = "york"` เป็น END ของทั้ง string ไม่ได้เช็กแต่ละคำแยก
> 2. **กฎตัวพิมพ์เฉพาะภาษา:** เช่น `İ` / `i` ของภาษาตุรกี
> 3. **ไม่สนเครื่องหมายบนตัวอักษร:** `é` ไม่ match กับ `e`
> 4. **Whitespace:** ไม่ trim `search` และ `items`
> 5. **Tie-break อื่นใน priority เดียวกัน:** เช่น ตำแหน่งที่เจอ ความยาว หรือ alphabetical ใช้ลำดับ input แทน
> 6. **Fuzzy match:** พิมพ์ผิด (`thnik`) ไม่ match `think`
> 7. **ค่าซ้ำ:** เก็บไว้ทั้งหมด ไม่ dedupe
> 8. **`null` / `undefined`:** ไม่ได้ validate
> 9. **`maxResult` ที่ไม่ใช่จำนวนเต็ม:** `slice` ปัดลง (`2.9` เป็น `2`)
>
> #### 5. Unit Test (`question3/autocomplete.test.ts`)
>
> ใช้ `node:test` + `node:assert/strict` ที่มากับ Node เหมือน question2 มี 22 tests ใน 6 suites:
>
> 1. **ตัวอย่างจากโจทย์:** ได้ `["Think", "Mother"]` และถ้า `maxResult = 10` ได้ครบ 3 คำ
> 2. **Priority:** START > MIDDLE > END, priority เท่ากันคงลำดับ input, ใช้ตำแหน่งแรกที่เจอ, item เท่ากับ search
> 3. **Ignore case:** search ตัวพิมพ์ใหญ่, ตัวพิมพ์ปนกัน, คืนค่าตัวพิมพ์เดิม
> 4. **maxResult:** มากกว่าจำนวนที่ match, `0`, ค่าติดลบ, ตัดหลัง sort
> 5. **เคสอื่น:** ไม่มีตัว match, `items` ว่าง, `search` ว่าง, search ยาวกว่า item, ค่าซ้ำ, ไม่แก้ input
> 6. **เคสที่ไม่ support (lock พฤติกรรมปัจจุบันไว้):** วลี, whitespace, เครื่องหมายบนตัวอักษร
>
> #### 6. วิธีรันและผลการรัน
>
> ```bash
> cd question3
> node autocomplete.ts              # demo
> node --test autocomplete.test.ts  # unit test
> ```
>
> ```
> [ 'Think', 'Mother' ]
>
> ℹ tests 22
> ℹ suites 6
> ℹ pass 22
> ℹ fail 0
> ```
>
> ตรวจ type ของ `autocomplete.ts` ด้วย `tsc --strict` แล้ว ไม่มี error ส่วน `autocomplete.test.ts` จะมี error ใน editor แบบเดียวกับ question2 (ไม่มี `@types/node` และ `tsconfig.json`) แต่ไม่มีผลกับการรัน test
