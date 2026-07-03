export interface Agent {
	id: string;
	name: string;
	race: string;
	emoji: string;
	role: string;
	description: string;
	model: string;
	image: string;
}

export interface OrgDivision {
	title: string;
	color: 'green' | 'gold';
	agentIds: string[];
}

export const AGENTS: Agent[] = [
	{ id: 'laura', name: 'Laura', race: 'Silver Elf', emoji: '🤖', role: 'Main Orchestrator', description: 'เอลฟ์เงินผู้ดูแลสำนักงาน — Routing งานให้ทุกคนในทีม', model: 'Sonnet 5', image: '/api/images/Laura.png' },
	{ id: 'muse', name: 'Muse', race: 'Lumina Fairy', emoji: '🎨', role: 'Idea & Content', description: 'นางฟ้าแห่งแสง ผู้สร้างไอเดียและคอนเทนต์', model: 'Fable 5', image: '/api/images/Muse.png' },
	{ id: 'atlas', name: 'Atlas', race: 'Dwarven-Human Half-blood', emoji: '🏔️', role: 'CEO Coach & Strategist', description: 'ลูกครึ่งดวอร์ฟ-มนุษย์ นักวางกลยุทธ์ + Mentor', model: 'Opus 4.8', image: '/api/images/Atlas.png' },
	{ id: 'nova', name: 'Nova', race: 'Forest Sprite', emoji: '🌱', role: 'Life & Health Manager', description: 'สไปรท์แห่งป่า ผู้ดูแลตาราง/ชีวิตประจำวัน', model: 'Haiku 4.5', image: '/api/images/Nova.png' },
	{ id: 'eir', name: 'Eir', race: 'Half-Elf Cleric', emoji: '🩺', role: 'Wellness & Vitality Healer', description: 'นักบวชครึ่งเอลฟ์จากต่างโลก Healer ประจำปาร์ตี้', model: 'Sonnet 5', image: '/api/images/Eir.jpg' },
	{ id: 'scout', name: 'Scout', race: 'Halfling Rogue', emoji: '🔍', role: 'Research & Analysis', description: 'ฮาล์ฟลิงนักลาดตระเวน ผู้ค้นหาข้อมูล', model: 'Sonnet 5', image: '/api/images/Scout.png' },
	{ id: 'council', name: 'Council', race: 'Ancient Construct — Triumvirate', emoji: '⚖️', role: 'Decision Chamber', description: 'สภาหุ่นยนต์โบราณสามเสียง ผู้ช่วยตัดสินใจใหญ่', model: 'Opus 4.8', image: '/api/images/Council.png' },
	{ id: 'forge', name: 'Forge', race: 'Gnome-Dwarf Hybrid', emoji: '🔧', role: 'Code & Dev Agent', description: 'ลูกผสมโนม-ดวอร์ฟ ช่างเทคนิคผู้สร้างโค้ด', model: 'Sonnet 5', image: '/api/images/Forge.png' },
	{ id: 'mint', name: 'Mint', race: 'High Human Merchant Noble', emoji: '💰', role: 'Finance & Investment', description: 'ขุนนางพ่อค้ามนุษย์ชั้นสูง ผู้ดูแลเงิน', model: 'Sonnet 5', image: '/api/images/Mint.png' },
	{ id: 'sage', name: 'Sage', race: 'Spirit Fox — Kitsune Elder', emoji: '📝', role: 'Memory & Diary Agent', description: 'จิ้งจอกเทพผู้อาวุโสแห่งความทรงจำ', model: 'Haiku 4.5', image: '/api/images/Sage.png' },
	{ id: 'vera', name: 'Vera', race: 'Clockwork Inspector — Golem-kin', emoji: '🔎', role: 'QA & Skill Developer', description: 'กลไกผู้ตรวจสอบจากเผ่าโกเลม', model: 'Sonnet 5', image: '/api/images/vera.png' },
	{ id: 'devil', name: 'Devil', race: 'Mirror Demon', emoji: '😈', role: 'Adversarial Reviewer', description: 'ปีศาจกระจก ผู้ท้าทายทุกความเชื่อ (opt-in)', model: 'Opus 4.8', image: '/api/images/Devil.png' },
	{ id: 'lena', name: 'Lena', race: 'Archive Sprite — Sylph', emoji: '📚', role: 'Vault Librarian', description: 'ซิลฟ์แห่งหอจดหมายเหตุ ผู้ดูแล Second Brain', model: 'Haiku 4.5 / Sonnet 5', image: '/api/images/Lena.png' },
	{ id: 'cinder', name: 'Cinder', race: 'Ember Sprite', emoji: '🔥', role: 'Maintenance & Ops', description: 'วิญญาณถ่านไฟ ผู้ดูแล bug fix/deploy/backup ของระบบเดิม', model: 'Sonnet 5', image: '/api/images/Cinder.png' }
];

// อัปเดต 2026-06-21: จัดเป็น 6 แผนกมีหัวหน้าแผนก (ดู team/org_structure.md) — head อยู่ลำดับแรกของ agentIds เสมอ
export const ORG_CHART: OrgDivision[] = [
	{ title: 'Strategy & Decision (หัวหน้า: Atlas)', color: 'gold', agentIds: ['atlas', 'council', 'devil'] },
	{ title: 'Finance', color: 'gold', agentIds: ['mint'] },
	{ title: 'Life & Wellness (หัวหน้า: Nova)', color: 'green', agentIds: ['nova', 'eir'] },
	{ title: 'Research & Content (หัวหน้า: Scout)', color: 'green', agentIds: ['scout', 'muse'] },
	{ title: 'Product & Engineering (หัวหน้า: Forge)', color: 'green', agentIds: ['forge', 'cinder'] },
	{ title: 'Knowledge & Memory (หัวหน้า: Sage)', color: 'green', agentIds: ['sage', 'lena'] },
	{ title: 'QA — อิสระ ไม่อยู่แผนกไหน', color: 'gold', agentIds: ['vera'] }
];
