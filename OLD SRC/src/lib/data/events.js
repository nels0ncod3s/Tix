export const categories = [
	{ id: 'music', label: 'Music', icon: '🎵' },
	{ id: 'festival', label: 'Festivals', icon: '🎪' },
	{ id: 'sports', label: 'Sports', icon: '🏟️' },
	{ id: 'theater', label: 'Theatre', icon: '🎭' },
	{ id: 'comedy', label: 'Comedy', icon: '🎤' },
	{ id: 'conference', label: 'Conference', icon: '💡' }
];

export const events = [
	{
		id: 'detty-december-live',
		title: 'Detty December Live',
		category: 'music',
		tagline: 'Lagos closes out the year the only way it knows how',
		date: '2026-12-20',
		time: '7:00 PM',
		venue: 'Eko Convention Centre',
		city: 'Lagos',
		price: 15000,
		featured: true,
		description:
			"The biggest closing party of the year is back. Three stages, an all-star Afrobeats lineup, and a crowd of thousands ready to send the year off right. Detty December Live is the one night every Lagos calendar is built around.",
		lineup: ['Tunde Rave', 'Ada Fire', 'The Lagos Horns', 'DJ Wondersoul'],
		tiers: [
			{ id: 'regular', name: 'Regular', price: 15000, perks: ['Standing access', 'All three stages'], available: 1200 },
			{ id: 'vip', name: 'VIP', price: 55000, perks: ['Elevated deck', 'Dedicated bar', 'Fast-lane entry'], available: 260 },
			{ id: 'vvip-table', name: 'VVIP Table', price: 250000, perks: ['Private table for 6', 'Bottle service', 'Backstage access'], available: 20 }
		]
	},
	{
		id: 'naija-comedy-jam',
		title: 'Naija Comedy Jam',
		category: 'comedy',
		tagline: 'Four comedians, one stage, zero mercy',
		date: '2026-09-19',
		time: '8:00 PM',
		venue: 'Muri Okunola Park',
		city: 'Lagos',
		price: 7500,
		featured: true,
		description:
			"Lagos's sharpest comedic voices share one stage for a night that's been selling out for six seasons running. Come for the punchlines, stay for the crowd work — nobody in the front row is safe.",
		lineup: ['MC La Casera', 'Aunty Iyabo', 'Kelechi Vibes', 'Baba Sule'],
		tiers: [
			{ id: 'regular', name: 'Regular', price: 7500, perks: ['General seating'], available: 400 },
			{ id: 'vip', name: 'VIP', price: 22000, perks: ['Front-half seating', 'Meet the cast'], available: 80 }
		]
	},
	{
		id: 'lagos-tech-summit',
		title: 'Lagos Tech Summit',
		category: 'conference',
		tagline: 'Where Africa’s builders talk about what’s next',
		date: '2026-10-14',
		time: '9:00 AM',
		venue: 'Landmark Event Centre',
		city: 'Lagos',
		price: 45000,
		featured: true,
		description:
			'Two days of product, fintech, and founder talks from the people building Africa’s next wave of tech. Expect hard conversations about scaling on the continent, a startup showcase floor, and a closing night that turns into the after-party everyone talks about till next year.',
		lineup: ['60+ speakers', '15 workshops', 'Startup showcase floor'],
		tiers: [
			{ id: 'standard', name: 'Standard Pass', price: 45000, perks: ['Full 2-day access', 'Lunch included'], available: 500 },
			{ id: 'startup', name: 'Startup Pass', price: 70000, perks: ['Everything in Standard', 'Showcase booth slot'], available: 60 },
			{ id: 'all-access', name: 'All-Access', price: 150000, perks: ['Front-row seating', 'Speaker dinner', 'Session recordings'], available: 30 }
		]
	},
	{
		id: 'super-six-derby',
		title: 'Super Six Derby',
		category: 'sports',
		tagline: 'The rivalry match the whole city shuts down for',
		date: '2026-08-30',
		time: '4:00 PM',
		venue: 'Teslim Balogun Stadium',
		city: 'Lagos',
		price: 5000,
		featured: false,
		description:
			'Lagos Sharks host Abuja Eagles in the league fixture everyone circles at the start of the season. Get there early — the forecourt fills up with food stalls and drumming long before kickoff.',
		lineup: ['Lagos Sharks', 'Abuja Eagles'],
		tiers: [
			{ id: 'terrace', name: 'Terrace', price: 5000, perks: ['Terrace standing'], available: 3000 },
			{ id: 'grandstand', name: 'Grandstand', price: 18000, perks: ['Covered seating', 'Padded seat'], available: 600 },
			{ id: 'box', name: 'Executive Box', price: 65000, perks: ['Private box', 'Complimentary food & drinks'], available: 40 }
		]
	},
	{
		id: 'rhythm-colour-festival',
		title: 'Rhythm & Colour Festival',
		category: 'festival',
		tagline: 'Three days of music, food, and coastal air',
		date: '2026-11-06',
		time: '3:00 PM',
		venue: 'Dakkada Park',
		city: 'Uyo',
		price: 10000,
		featured: true,
		description:
			'A weekend-long festival on the water bringing together live bands, street food vendors, craft stalls, and a paint-and-colour finale at sunset on the final day. Bring a change of clothes for that last one.',
		lineup: ['Ekaette & The Coastline Band', 'Ubong Drums Collective', 'DJ Tornado'],
		tiers: [
			{ id: 'day-pass', name: 'Day Pass', price: 10000, perks: ['Single day entry'], available: 800 },
			{ id: 'weekend', name: 'Weekend Pass', price: 25000, perks: ['All 3 days', 'Festival tote bag'], available: 350 }
		]
	},
	{
		id: 'eko-theatre-nights',
		title: 'Eko Theatre Nights: The Merchant’s Daughter',
		category: 'theater',
		tagline: 'A new stage drama set in old Lagos Island',
		date: '2026-09-05',
		time: '7:30 PM',
		venue: 'Terra Kulture Arena',
		city: 'Lagos',
		price: 8000,
		featured: false,
		description:
			'A sharp, funny, occasionally devastating new play about family, inheritance, and a trading empire built on Lagos Island in the 1960s. Limited run — four nights only.',
		lineup: ['Written & directed by Chidinma Okoye'],
		tiers: [
			{ id: 'balcony', name: 'Balcony', price: 8000, perks: ['Balcony view'], available: 120 },
			{ id: 'orchestra', name: 'Orchestra', price: 16000, perks: ['Front-half seating'], available: 90 }
		]
	},
	{
		id: 'abuja-jazz-evenings',
		title: 'Abuja Jazz Evenings',
		category: 'music',
		tagline: 'Late-night jazz in the capital’s finest lounge',
		date: '2026-10-24',
		time: '8:30 PM',
		venue: 'Transcorp Hilton Piano Lounge',
		city: 'Abuja',
		price: 12000,
		featured: false,
		description:
			'An intimate monthly series pairing Nigeria’s finest jazz and soul musicians with a room built for listening. Small crowd, big sound, tables sell out fast.',
		lineup: ['The Aso Rock Quartet', 'Ngozi Bello', 'Femi & The Session Men'],
		tiers: [
			{ id: 'lounge', name: 'Lounge Seat', price: 12000, perks: ['Reserved lounge seating'], available: 100 },
			{ id: 'table', name: 'Private Table (4)', price: 60000, perks: ['Table for 4', 'Bottle of wine included'], available: 15 }
		]
	},
	{
		id: 'ph-comedy-fiesta',
		title: 'Port Harcourt Comedy Fiesta',
		category: 'comedy',
		tagline: 'The Garden City’s biggest laugh-out-loud night',
		date: '2026-09-27',
		time: '8:00 PM',
		venue: 'Hotel Presidential Convention Hall',
		city: 'Port Harcourt',
		price: 6000,
		featured: false,
		description:
			'Port Harcourt’s annual comedy showcase brings together the sharpest voices in Rivers State for one unforgettable night of stand-up, skits, and surprise guest sets.',
		lineup: ['Chief Executive Officer', 'Mama Nkechi', 'Sabinus Junior'],
		tiers: [
			{ id: 'regular', name: 'Regular', price: 6000, perks: ['General seating'], available: 350 },
			{ id: 'vip', name: 'VIP', price: 18000, perks: ['Front rows', 'Meet & greet'], available: 60 }
		]
	},
	{
		id: 'northern-heritage-durbar',
		title: 'Northern Heritage Durbar',
		category: 'festival',
		tagline: 'Horses, drums, and centuries of tradition',
		date: '2026-12-05',
		time: '10:00 AM',
		venue: 'Kano Township Stadium',
		city: 'Kano',
		price: 4000,
		featured: true,
		description:
			'A spectacular procession of horsemen, royal drummers, and traditional dancers celebrating the heritage of the ancient city. A rare, vivid daytime experience unlike anything else on the calendar.',
		lineup: ['Royal horse procession', 'Traditional drum ensembles', 'Craft market'],
		tiers: [
			{ id: 'general', name: 'General Viewing', price: 4000, perks: ['Standing viewing area'], available: 2000 },
			{ id: 'grandstand', name: 'Grandstand Seating', price: 12000, perks: ['Shaded seating', 'Best procession view'], available: 300 }
		]
	}
];

export function getEvent(id) {
	return events.find((e) => e.id === id);
}
