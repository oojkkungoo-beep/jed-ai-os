const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Laura";
pres.title = "หลักสูตรวิสัญญีพยาบาล 1 ปี - รพ.ภูมิพลอดุลยเดช พอ.";

const NAVY = "1E2761";
const ICE = "CADCFC";
const WHITE = "FFFFFF";
const ACCENT = "028090"; // teal accent

let slide = pres.addSlide();
slide.background = { color: WHITE };

// Title block
slide.addText("หลักสูตรฝึกอบรมวิสัญญีพยาบาล ระยะเวลา 1 ปี", {
  x: 0.5, y: 0.35, w: 12.3, h: 0.7,
  fontSize: 30, bold: true, color: NAVY, fontFace: "Cambria", align: "left", margin: 0,
});
slide.addText("กองวิสัญญีและห้องผ่าตัด รพ.ภูมิพลอดุลยเดช พอ.  |  สถาบันฝึกอบรมตั้งแต่ ต.ค. 2557", {
  x: 0.5, y: 1.05, w: 12.3, h: 0.4,
  fontSize: 15, color: ACCENT, fontFace: "Calibri", italic: true, margin: 0,
});

// --- Big stat callouts (left column, 3 stacked cards) ---
const cardX = 0.5;
const cardW = 3.3;
const cardData = [
  { num: "12", label: "รุ่น ที่เปิดฝึกอบรม\n(ปีงบประมาณ 2558 - ปัจจุบัน)" },
  { num: "46+", label: "นายทหาร/พยาบาล สำเร็จการศึกษา\n(รุ่น 1-8 สะสม)" },
  { num: "2557", label: "ปีที่ได้รับอนุมัติเป็น\nสถาบันฝึกอบรมอย่างเป็นทางการ" },
];

cardData.forEach((c, i) => {
  const y = 1.75 + i * 1.65;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: cardX, y: y, w: cardW, h: 1.45,
    fill: { color: i % 2 === 0 ? NAVY : ACCENT },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.15 },
  });
  slide.addText(c.num, {
    x: cardX + 0.2, y: y + 0.12, w: 1.5, h: 1.2,
    fontSize: 40, bold: true, color: WHITE, fontFace: "Cambria",
    align: "left", valign: "middle", margin: 0,
  });
  slide.addText(c.label, {
    x: cardX + 1.6, y: y + 0.12, w: cardW - 1.7, h: 1.2,
    fontSize: 12.5, color: ICE, fontFace: "Calibri",
    align: "left", valign: "middle", margin: 0,
  });
});

// --- Why this course exists (top right small block) ---
slide.addText("ที่มา: แก้ปัญหาวิสัญญีพยาบาลขาดแคลนขั้นวิกฤต ที่กระทบความปลอดภัยผู้ป่วยผ่าตัด — ผลิตบุคลากรอย่างยั่งยืนทั้งใน ทอ. และส่งต่อให้หน่วยงานสาธารณสุขทั่วประเทศ", {
  x: 4.1, y: 1.65, w: 8.7, h: 0.85,
  fontSize: 13.5, color: NAVY, fontFace: "Calibri",
  align: "left", valign: "top", margin: 0, italic: true,
});

// --- Course structure (icon-row style, right side) ---
const structX = 4.1;
const structY = 2.7;
const boxW = 4.2;
const structures = [
  { title: "ภาคทฤษฎี (50%)", desc: "สอนโดยวิสัญญีแพทย์ ≥ 80% ของเวลาเรียน\nสอบ Basic / Clinical / Final" },
  { title: "ภาคปฏิบัติ (50%)", desc: "ปฏิบัติงานในและนอกห้องผ่าตัดตลอดปี\nเก็บเคสผู้ป่วย ≥ 150 รายต่อคน" },
];
structures.forEach((s, i) => {
  const x = structX + i * (boxW + 0.3);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: structY, w: boxW, h: 1.55,
    fill: { color: ICE },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: structY, w: 0.1, h: 1.55,
    fill: { color: NAVY },
  });
  slide.addText(s.title, {
    x: x + 0.3, y: structY + 0.15, w: boxW - 0.4, h: 0.4,
    fontSize: 16, bold: true, color: NAVY, fontFace: "Cambria", margin: 0,
  });
  slide.addText(s.desc, {
    x: x + 0.3, y: structY + 0.58, w: boxW - 0.4, h: 0.9,
    fontSize: 12, color: NAVY, fontFace: "Calibri", margin: 0, lineSpacingMultiple: 1.15,
  });
});

// --- Chart: source of trainees by รุ่น (stacked column) ---
const ranYears = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const tafData = [5, 5, 0, 3, 4, 3, 5, 3, 5];
const otherData = [0, 0, 5, 2, 4, 5, 1, 3, 1];

slide.addText("จำนวนผู้เข้ารับการฝึกอบรมแต่ละรุ่น แยกตามต้นสังกัด (ทอ. / นอก ทอ.)", {
  x: 4.1, y: 4.55, w: 8.7, h: 0.4,
  fontSize: 14, bold: true, color: NAVY, fontFace: "Calibri", margin: 0,
});

slide.addChart(
  pres.charts.BAR,
  [
    { name: "ทอ.", labels: ranYears, values: tafData },
    { name: "นอก ทอ.", labels: ranYears, values: otherData },
  ],
  {
    x: 4.1, y: 4.95, w: 8.7, h: 2.35,
    barDir: "col", barGrouping: "stacked",
    chartColors: [NAVY, ACCENT],
    chartArea: { fill: { color: WHITE } },
    catAxisLabelColor: "64748B",
    valAxisLabelColor: "64748B",
    catAxisTitle: "รุ่นที่",
    showCatAxisTitle: true,
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelPosition: "ctr",
    dataLabelColor: WHITE,
    dataLabelFontSize: 10,
    legendPos: "t",
    showLegend: true,
    valAxisMinVal: 0,
    valAxisMaxVal: 10,
  }
);

// Footer note
slide.addText("ที่มา: เอกสารโครงการฝึกอบรมวิสัญญีพยาบาล หลักสูตร 1 ปี รพ.ภูมิพลอดุลยเดช พอ.  |  ข้อมูล ณ ปีงบประมาณ 2566 (รุ่น 9 อยู่ระหว่างฝึกอบรม)", {
  x: 0.5, y: 7.05, w: 12.3, h: 0.35,
  fontSize: 10, color: "94A3B8", fontFace: "Calibri", margin: 0,
});

pres.writeFile({ fileName: "หลักสูตรวิสัญญีพยาบาล_1หน้า.pptx" }).then(() => console.log("done"));
