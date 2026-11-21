# Question 2 — Prompt Log

> [!NOTE]
> **Prompt**: ข้อความที่พิมพ์ถาม AI (กล่องสีฟ้า)

> [!TIP]
> **Answer**: คำตอบจาก AI (กล่องสีเขียว)

## Section 1: วิเคราะห์ Response ของการ Sort String[] และเงื่อนไขที่อาจซ่อนอยู่

### Prompt

> [!NOTE]
> **Prompt**
>
> ช่วยวิเคราะ response ของชุด String [] ในเคสนี้หน่อย<br>
> [“TH19”, “SG20” , “TH2”] => [ “SG20” , “TH2”, “TH19”,]<br>
> [“TH10”, “TH3Netflix” , “TH1”, “TH7”] => [ “TH1”, “TH3Netflix” , “TH7”, “TH10”]
>
> นอกจากการ sort prefix ตาม Alphabetical Order และ Number ตาม Numeric Order แล้วมันมีโอกาศที่จะ มีเงื่อนไขอื่นอีกมั้ย

### Answer

> [!TIP]
> **Answer**
>
> #### 1. วิเคราะห์ pattern จากตัวอย่าง
>
> โครงสร้างของแต่ละ string คือ `[prefix ตัวอักษร][ตัวเลข][suffix (optional)]` เช่น `TH` + `3` + `Netflix`
>
> ลำดับการเปรียบเทียบที่อนุมานได้:
>
> 1. **Prefix** เทียบแบบ alphabetical: `SG20` มาก่อน `TH2` เพราะ `SG` < `TH` แม้ 20 > 2 ดังนั้น prefix มีน้ำหนักมากกว่าตัวเลข
> 2. **Number** เทียบแบบ numeric (ไม่ใช่ lexicographic): `TH2` < `TH19` และ `TH7` < `TH10`
> 3. **Suffix** (`Netflix`) ในตัวอย่างไม่มีผลต่อลำดับ เพราะตัวเลขต่างกันอยู่แล้ว (`3` อยู่ระหว่าง `1` กับ `7`)
>
> ถ้าใช้ `Array.prototype.sort()` แบบ default จะได้ผลผิด เพราะเทียบ string ทีละตัวอักษร:
>
> ```
> ["TH19","SG20","TH2"]             default => ["SG20","TH19","TH2"]          (ผิด)
> ["TH10","TH3Netflix","TH1","TH7"] default => ["TH1","TH10","TH3Netflix","TH7"] (ผิด)
> ```
>
> สรุป: โจทย์ต้องการ **Natural Sort** (เรียงแบบที่มนุษย์อ่าน)
>
> #### 2. เงื่อนไขอื่นที่อาจซ่อนอยู่ (ควรถามผู้สัมภาษณ์หรือกำหนด assumption ให้ชัด)
>
> | # | กรณี | ตัวอย่าง | คำถามที่ต้องตัดสินใจ |
> |---|------|---------|-------------------|
> | 1 | Prefix และ number เท่ากัน ต่างแค่ suffix | `TH3`, `TH3Netflix`, `TH3Amazon` | ตัวที่ไม่มี suffix มาก่อนหรือไม่ และ suffix เรียง alphabetical หรือไม่ (natural sort ให้ `TH3`, `TH3Amazon`, `TH3Netflix`) |
> | 2 | Case sensitivity | `th2`, `TH10`, `Th1` | ถ้าเทียบตาม ASCII ตัวพิมพ์ใหญ่จะมาก่อนตัวพิมพ์เล็กทั้งหมด ต้องการ case-insensitive หรือไม่ |
> | 3 | Leading zeros | `TH02`, `TH2`, `TH002` | ค่าตัวเลขเท่ากัน จะใช้อะไรตัดสิน (คงลำดับเดิม / ตัวสั้นก่อน / ตัวยาวก่อน) |
> | 4 | Prefix ความยาวไม่เท่ากัน | `T1`, `TH1`, `THA1` | `T` < `TH` < `THA` ตาม alphabetical ต้องแยก prefix ให้ถูกก่อนเทียบ ห้ามเทียบ string ทั้งก้อน |
> | 5 | ไม่มีตัวเลข หรือ ไม่มี prefix | `TH`, `1TH`, `123` | จะวางไว้ต้นหรือท้าย array |
> | 6 | ตัวเลขหลายช่วง | `TH3Netflix2`, `TH3Netflix10` | suffix ต้องเทียบแบบ natural ต่อหรือไม่ (`2` < `10`) |
> | 7 | ตัวเลขใหญ่เกิน `Number.MAX_SAFE_INTEGER` | `TH99999999999999999999` | `parseInt` จะเสีย precision ต้องเทียบด้วย `BigInt` หรือเทียบความยาวหลังตัด leading zero แล้วค่อยเทียบ string |
> | 8 | Input ผิดรูปแบบ | `""`, `"TH 2"`, `null`, `undefined` | ต้อง trim / validate / throw error หรือไม่ |
> | 9 | ค่าซ้ำ | `TH2`, `TH2` | ต้องเก็บทั้งคู่หรือ dedupe และต้องการ stable sort หรือไม่ (ES2019+ รับประกันว่า `sort` เป็น stable) |
> | 10 | ตัวอักษร non-ASCII / locale | `ไทย1`, `ÉU2` | ใช้ `localeCompare` ตาม locale ไหน |
> | 11 | Immutability | - | ห้าม mutate input ใช้ `[...arr].sort()` หรือ `arr.toSorted()` |
> | 12 | ทิศทางการเรียง | - | ต้องรองรับ descending ด้วยหรือไม่ |
> | 13 | Performance | array ขนาดใหญ่ | ควร parse key ครั้งเดียวก่อน sort (Schwartzian transform) แทนการใช้ regex ซ้ำใน comparator ทุกครั้ง |
>
> #### 3. ผลทดสอบจริงด้วย `Intl.Collator` (numeric: true, sensitivity: "base")
>
> ```
> ["TH19","SG20","TH2"]                 => ["SG20","TH2","TH19"]
> ["TH10","TH3Netflix","TH1","TH7"]     => ["TH1","TH3Netflix","TH7","TH10"]
> ["TH3Netflix","TH3","TH3Amazon"]      => ["TH3","TH3Amazon","TH3Netflix"]
> ["th2","TH10","Th1"]                  => ["Th1","th2","TH10"]
> ["TH02","TH2","TH002"]                => ["TH02","TH2","TH002"]   (ถือว่าเท่ากัน คงลำดับเดิม)
> ["T1","TH1","THA1"]                   => ["T1","TH1","THA1"]
> ["TH","TH1","1TH"]                    => ["1TH","TH","TH1"]
> ["TH3Netflix10","TH3Netflix2"]        => ["TH3Netflix2","TH3Netflix10"]
> ["TH99999999999999999999","TH100000000000000000000"] => เรียงถูกต้อง
> ```
>
> `Intl.Collator` ให้ผลตรงกับ 2 ตัวอย่างของโจทย์ และจัดการ edge case ส่วนใหญ่ได้ แต่กรณี leading zeros (ข้อ 3) และกรณีไม่มีตัวเลข (ข้อ 5) จะคืนค่าตามพฤติกรรม default ของ collator ถ้าโจทย์ต้องการกฎเฉพาะ ต้องเขียน comparator เอง โดย parse เป็น `{ prefix, number, suffix }` แล้วเทียบทีละ field
>
> #### 4. ข้อแนะนำ
>
> - เขียน assumption ที่เลือกไว้ใน README หรือ comment ของ code (ข้อ 1, 2, 3, 5 สำคัญที่สุด)
> - เขียน unit test ครอบคลุมทั้ง 2 ตัวอย่างของโจทย์และ edge case ในตารางด้านบน
> - ทางเลือกในการ implement:
>   - **แบบสั้น:** `[...arr].sort(new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare)`
>   - **แบบ explicit:** parse ด้วย regex `/^([A-Za-z]*)(\d*)(.*)$/` แล้วเทียบ prefix → number → suffix แบบนี้ควบคุมกฎ edge case ได้ชัดเจนกว่า และอธิบายตอนสัมภาษณ์ได้ง่ายกว่า

---

## Section 2: Implement Function และระบุเคสที่ไม่ได้ Support

### Prompt

> [!NOTE]
> **Prompt**
>
> งั้นลอง apply function จริงที่สามารถ solve คำตอบที่ส่งไปให้หน่อย พร้อมลิส เงื่อนไขอื่นที่สามารถเกิดขี้นได้ เป็น remark ไว้ว่าไม่ได้ support เคสเหล่านี้

### Answer

> [!TIP]
> **Answer**
>
> สร้างไฟล์ `question2/sortString.ts` ซึ่งมี function `sortCodes(input: string[]): string[]`
>
> #### แนวทาง
>
> 1. Parse แต่ละ string ครั้งเดียวด้วย regex `/^([A-Za-z]+)(\d+)(.*)$/` ได้ `{ prefix, number, suffix }`
> 2. เรียงตามลำดับ:
>    - `prefix` เทียบ alphabetical (`SG` < `TH`)
>    - `number` เทียบ numeric (`2` < `10` < `19`)
>    - `suffix` เทียบ alphabetical ใช้เป็น tie-breaker เท่านั้น (`""` < `Amazon` < `Netflix`)
> 3. String ที่ไม่ตรง format จะถูกย้ายไปท้าย array และเรียงด้วย string compare ธรรมดา
> 4. Return array ใหม่ ไม่แก้ input เดิม
>
> #### ผลการรัน (`node sortString.ts`, Node v24)
>
> ```
> sortCodes(["TH19", "SG20", "TH2"])               => [ 'SG20', 'TH2', 'TH19' ]
> sortCodes(["TH10", "TH3Netflix", "TH1", "TH7"])  => [ 'TH1', 'TH3Netflix', 'TH7', 'TH10' ]
> ```
>
> ทดสอบ edge case เพิ่มเติม (ไม่ได้ใส่ไว้ในไฟล์):
>
> ```
> ["TH3Netflix","TH3","TH3Amazon"]  => [ 'TH3', 'TH3Amazon', 'TH3Netflix' ]   (support)
> ["th2","TH10","Th1"]              => [ 'TH10', 'Th1', 'th2' ]               (ไม่ support case-insensitive)
> ["TH","123","TH1","","SG5"]       => [ 'SG5', 'TH1', '', '123', 'TH' ]      (format ผิดไปอยู่ท้าย)
> input เดิม ["TH2","SG1"]            => ไม่ถูกแก้ไข
> ```
>
> #### Remark: เคสที่ไม่ได้ Support
>
> 1. **Case-insensitive:** เทียบด้วย char code ดังนั้น prefix ตัวพิมพ์ใหญ่ทุกตัวมาก่อน prefix ตัวพิมพ์เล็ก (`TH10` มาก่อน `th2`)
> 2. **Leading zeros:** `TH02`, `TH2`, `TH002` มี number เท่ากัน จึงคงลำดับตาม input เดิม ไม่มีกฎเฉพาะ
> 3. **ไม่มี prefix หรือไม่มีตัวเลข:** เช่น `123`, `TH`, `1TH`, `""` ถูกย้ายไปท้าย array
> 4. **ตัวเลขหลายช่วงใน suffix:** `TH3Netflix10` กับ `TH3Netflix2` suffix เทียบแบบ string ธรรมดา จึงได้ `Netflix10` < `Netflix2`
> 5. **ตัวเลขใหญ่เกิน `Number.MAX_SAFE_INTEGER`:** ค่าจะเสีย precision
> 6. **Whitespace:** ไม่ trim ค่า (`"TH 2"` ถือว่า format ผิด)
> 7. **`null` / `undefined`:** ไม่ได้ validate
> 8. **Prefix ที่ไม่ใช่ ASCII:** ตัวอักษรไทยหรือตัวอักษรมีเครื่องหมาย regex จะไม่ match
> 9. **Descending order:** ไม่รองรับ
> 10. **ค่าซ้ำ:** เก็บไว้ทั้งหมด ไม่ dedupe

---

## Section 3: Unit Test

### Prompt

> [!NOTE]
> **Prompt**
>
> สามารถทำ Unit test ให้ question2 ด้วยได้มั้ย

### Answer

> [!TIP]
> **Answer**
>
> สร้างไฟล์ `question2/sortString.test.ts` โดยใช้ test runner ที่มากับ Node (`node:test` + `node:assert/strict`) ไม่ต้องติดตั้ง dependency เพิ่ม
>
> #### การเปลี่ยนแปลงใน `sortString.ts`
>
> - เพิ่ม `export` ให้ `sortCodes` เพื่อให้ไฟล์ test import ได้
> - ครอบ `console.log` ตัวอย่างด้วย `if (import.meta.main)` เพื่อให้แสดงผลเฉพาะตอนรันไฟล์โดยตรง ไม่แสดงตอน import ใน test
>
> #### วิธีรัน
>
> ```bash
> cd question2
> node --test sortString.test.ts   # unit test (Node 24+)
> node sortString.ts               # demo
> ```
>
> #### Test cases (15 tests, 3 suites)
>
> 1. **ตัวอย่างจากโจทย์**
>    - `["TH19","SG20","TH2"]` => `["SG20","TH2","TH19"]`
>    - `["TH10","TH3Netflix","TH1","TH7"]` => `["TH1","TH3Netflix","TH7","TH10"]`
> 2. **กฎที่ support**
>    - prefix มีน้ำหนักมากกว่า number
>    - prefix ความยาวต่างกัน (`T1` < `TH1` < `THA1`)
>    - prefix และ number เท่ากัน: ตัวที่ไม่มี suffix มาก่อน แล้วเรียง suffix ตาม alphabetical
>    - ตัวเลขหลายหลัก
>    - เก็บค่าซ้ำไว้
>    - array ว่าง และ array ที่มี 1 ตัว
>    - ไม่แก้ input และ return array ใหม่
>    - string ที่ format ผิดไปอยู่ท้าย array
> 3. **เคสที่ไม่ support (lock พฤติกรรมปัจจุบันไว้ ถ้าเพิ่ม support ภายหลังต้องแก้ test ชุดนี้)**
>    - case-sensitive: prefix ตัวพิมพ์ใหญ่มาก่อนตัวพิมพ์เล็ก
>    - leading zeros: number เท่ากัน คงลำดับตาม input
>    - ตัวเลขใน suffix เทียบแบบ string ธรรมดา
>    - ไม่ trim whitespace
>
> #### ผลการรัน
>
> ```
> ℹ tests 15
> ℹ suites 3
> ℹ pass 15
> ℹ fail 0
> ```

---

## Section 4: เอา `import.meta.main` ออก และอธิบายหลักการรัน Test

### Prompt

> [!NOTE]
> **Prompt**
>
> เอา import.meta.main ออก ให้ไม่มี error แล้วอธิบายหลักการ การทำ test ในส่วนนี้หน่อยว่า เราเทสตรงนี้ได้ยังไง ทั้งที่ยังไม่ได้ install node

### Answer

> [!TIP]
> **Answer**
>
> #### สิ่งที่แก้
>
> ลบ block `if (import.meta.main) { console.log(...) }` ออกจาก `sortString.ts` ตอนนี้ไฟล์มีแค่ function `sortCodes` ที่ `export` ไว้ ตัวอย่างทั้ง 2 ชุดของโจทย์ยังถูกตรวจอยู่ใน `sortString.test.ts`
>
> ผลการรัน `node --test sortString.test.ts` หลังแก้: `tests 15, pass 15, fail 0`
>
> #### ทำไมรัน test ได้ ทั้งที่ยังไม่ได้ install
>
> ความจริงคือ **Node ติดตั้งอยู่แล้ว** ในเครื่อง (`v24.15.0` ผ่าน nvm) สิ่งที่ยังไม่ได้ทำคือ `npm install` ซึ่งเป็นคนละเรื่องกัน
>
> | สิ่งที่ต้องใช้ | มาจากไหน | ต้อง `npm install` หรือไม่ |
> |---|---|---|
> | รัน JavaScript | Node runtime | ไม่ต้อง |
> | รันไฟล์ `.ts` | Node 24 มี **type stripping** ในตัว: ลบ type annotation ออกแล้วรันเป็น JavaScript (`process.features.typescript` = `"strip"`) | ไม่ต้อง |
> | Test runner (`describe`, `test`) | module `node:test` ที่มากับ Node (built-in) | ไม่ต้อง |
> | Assertion (`assert.deepEqual`) | module `node:assert/strict` ที่มากับ Node (built-in) | ไม่ต้อง |
> | Type ของ Node สำหรับ editor / `tsc` | package `@types/node` | ต้อง |
>
> ขั้นตอนเมื่อรัน `node --test sortString.test.ts`:
>
> 1. Node อ่านไฟล์ `.ts` แล้วลบ type ออก (ไม่ได้ตรวจ type)
> 2. `import { sortCodes } from "./sortString.ts"` โหลดไฟล์ function แบบเดียวกัน
> 3. `node:test` เก็บทุก `test(...)` แล้วรันทีละตัว
> 4. ใน test แต่ละตัว `assert.deepEqual(actual, expected)` เทียบผลจริงกับผลที่คาดไว้ ถ้าไม่ตรงจะ throw error และ test นั้น fail
> 5. Node สรุปผลเป็น `tests / pass / fail`
>
> #### ข้อจำกัด: error ใน editor ที่ยังเหลือ
>
> Node ไม่ตรวจ type ตอนรัน error ใน editor จึงไม่ทำให้ test fail แต่ editor ใช้ TypeScript ที่ตรวจ type ด้วย ตรวจด้วย `tsc --strict` แล้ว:
>
> - `sortString.ts`: ไม่มี error แล้ว
> - `sortString.test.ts`: ยังมี error 3 จุด
>   - `TS2307: Cannot find module 'node:test'` เพราะไม่มี `@types/node`
>   - `TS2307: Cannot find module 'node:assert/strict'` เพราะไม่มี `@types/node`
>   - `TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.` เพราะไม่มี `tsconfig.json`
>
> ถ้าต้องการให้ editor ไม่ขึ้น error ต้องมี `@types/node` และ `tsconfig.json` (ไม่จำเป็นสำหรับการรัน test)


---

## Section 5: แบ่งสี Prompt / Answer และเพิ่ม README

### Prompt

> [!NOTE]
> **Prompt**
>
> เจ๋งแล้วนะ ต่อไปใน ส่วนของไฟล์ prompt.md แบ่งสี ให้ชัดเจนให้หน่อยว่า ส่วนไหนเป็นส่วนของ prompt และส่วน ไหนเป็น ส่วนของ answer พร้อมทำ README ไว้นอกสุด เพื่อสาธิตการอ่าน prompt ของแต่ละข้อให้ด้วย

### Answer

> [!TIP]
> **Answer**
>
> #### แบ่งสีใน `prompt.md`
>
> ใช้ syntax GitHub Alerts แยก prompt กับ answer ทุก Section:
>
> - **Prompt** อยู่ในกล่อง `> [!NOTE]` (สีฟ้า)
> - **Answer** อยู่ในกล่อง `> [!TIP]` (สีเขียว)
> - เพิ่ม legend อธิบายสีไว้ใต้หัวเรื่องของไฟล์
> - เก็บหัวข้อ `### Prompt` และ `### Answer` ไว้ ถ้าโปรแกรมที่เปิดไม่รองรับ GitHub Alerts จะยังแยกส่วนได้
> - เนื้อหาเดิมไม่ได้เปลี่ยน แค่ย้ายเข้าไปอยู่ในกล่อง
>
> Markdown ทั่วไปใส่สีด้วย CSS หรือ `style` ไม่ได้ เพราะ GitHub ลบ inline style ออก GitHub Alerts จึงเป็นวิธีที่แสดงสีบน GitHub ได้
>
> #### `README.md` ที่ root ของ repository
>
> - โครงสร้าง folder และตารางลิงก์ไปที่ code และ `prompt.md` ของแต่ละข้อ (question1 ยังไม่มี `prompt.md`)
> - วิธีอ่าน `prompt.md`: ตารางความหมายของสี ตัวอย่างที่ render จริง และ Markdown ที่ใช้
> - วิธีรันแต่ละข้อด้วย Node 24 (ไม่ต้อง `npm install`)
