# Web Dev Interview — Saharath Suwannawong

Repository นี้เก็บคำตอบของโจทย์สัมภาษณ์แต่ละข้อ แยกเป็น folder ละ 1 ข้อ แต่ละข้อมีไฟล์ `prompt.md` ที่บันทึกการคุยกับ AI ไว้ (prompt ที่พิมพ์ถาม และคำตอบที่ได้)

## โครงสร้าง

```
.
├── README.md
├── question1/
│   ├── prompt.md              # บันทึก prompt และ answer
│   ├── validString.ts         # function isValid (Valid Parentheses)
│   └── validString.test.ts    # unit test
├── question2/
│   ├── prompt.md              # บันทึก prompt และ answer
│   ├── sortString.ts          # function sortCodes
│   └── sortString.test.ts     # unit test
├── question3/
│   ├── prompt.md              # บันทึก prompt และ answer
│   ├── autocomplete.ts        # function autocomplete
│   └── autocomplete.test.ts   # unit test
├── question4/
│   ├── prompt.md              # บันทึก prompt และ answer
│   ├── romanNumerals.ts       # function toRoman / fromRoman
│   └── romanNumerals.test.ts  # unit test
├── question5/
│   ├── prompt.md                 # บันทึก prompt และ answer
│   ├── descendingDigits.ts       # function sortDigitsDescending
│   └── descendingDigits.test.ts  # unit test
└── question6/
    ├── prompt.md              # บันทึก prompt และ answer
    ├── tribonacci.ts          # function tribonacci
    └── tribonacci.test.ts     # unit test
```

| ข้อ | หัวข้อ | Code | Prompt log |
|-----|-------|------|------------|
| 1 | Valid Parentheses | [`question1/validString.ts`](question1/validString.ts) | [`question1/prompt.md`](question1/prompt.md) |
| 2 | Sort Codes (prefix + number + suffix) | [`question2/sortString.ts`](question2/sortString.ts) | [`question2/prompt.md`](question2/prompt.md) |
| 3 | Autocomplete (เรียงตามตำแหน่งที่เจอ) | [`question3/autocomplete.ts`](question3/autocomplete.ts) | [`question3/prompt.md`](question3/prompt.md) |
| 4 | Modern Roman Numerals | [`question4/romanNumerals.ts`](question4/romanNumerals.ts) | [`question4/prompt.md`](question4/prompt.md) |
| 5 | Sort Digits Descending | [`question5/descendingDigits.ts`](question5/descendingDigits.ts) | [`question5/prompt.md`](question5/prompt.md) |
| 6 | Tribonacci | [`question6/tribonacci.ts`](question6/tribonacci.ts) | [`question6/prompt.md`](question6/prompt.md) |

## วิธีอ่าน `prompt.md`

ไฟล์ `prompt.md` แบ่งเป็น Section ตามลำดับการคุย 1 Section = 1 prompt + 1 answer และแยกด้วยเส้นคั่น (`---`)

แต่ละ Section ใช้สีแยก prompt กับ answer:

| สี | กล่อง | ความหมาย |
|----|------|---------|
| ฟ้า | `[!NOTE]` | **Prompt**: ข้อความที่พิมพ์ถาม AI (คัดลอกมาตามจริง ไม่ได้แก้คำผิด) |
| เขียว | `[!TIP]` | **Answer**: คำตอบจาก AI |

### ตัวอย่าง

ตัวอย่างนี้ย่อมาจาก Section 3 ของ `question2/prompt.md`

> [!NOTE]
> **Prompt**
>
> สามารถทำ Unit test ให้ question2 ด้วยได้มั้ย

> [!TIP]
> **Answer**
>
> สร้างไฟล์ `question2/sortString.test.ts` โดยใช้ test runner ที่มากับ Node (`node:test` + `node:assert/strict`)
>
> ```
> ℹ tests 15
> ℹ pass 15
> ℹ fail 0
> ```

### Markdown ที่ใช้

```markdown
> [!NOTE]
> **Prompt**
>
> ข้อความที่ถาม

> [!TIP]
> **Answer**
>
> คำตอบ
```

สีจะแสดงเมื่อเปิดบน GitHub เพราะใช้ syntax [GitHub Alerts](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts) ถ้าเปิดด้วยโปรแกรมที่ไม่รองรับ จะเห็นเป็น blockquote ธรรมดา แต่ยังแยกได้จากหัวข้อ `### Prompt` และ `### Answer`

## วิธีรัน

ต้องมี Node.js 24 ขึ้นไป Node รันไฟล์ `.ts` ได้โดยตรง ไม่ต้อง `npm install` รันทุกคำสั่งจาก root ของ repository

```bash
# Question 1
node question1/validString.ts               # demo
node --test question1/validString.test.ts   # unit test

# Question 2
node question2/sortString.ts                # demo
node --test question2/sortString.test.ts    # unit test

# Question 3
node question3/autocomplete.ts              # demo
node --test question3/autocomplete.test.ts  # unit test

# Question 4
node question4/romanNumerals.ts               # demo
node --test question4/romanNumerals.test.ts   # unit test

# Question 5
node question5/descendingDigits.ts              # demo
node --test question5/descendingDigits.test.ts  # unit test

# Question 6
node question6/tribonacci.ts                # demo
node --test question6/tribonacci.test.ts    # unit test

# ทุกข้อพร้อมกัน
node --test question*/*.test.ts
```
