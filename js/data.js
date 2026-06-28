/* ===========================================================
   AURELIA & BAY — Static Data
   Placeholder content for a fictional luxury hotel.
   Images sourced from Unsplash (royalty-free placeholders).
   =========================================================== */

const ROOMS = [
  {
    id: 'deluxe-room',
    name: 'Deluxe Room',
    type: 'Deluxe',
    price: 189,
    rating: 4.7,
    reviews: 214,
    guests: 2,
    bed: 'Queen Bed',
    size: '32 m²',
    available: true,
    img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=900&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=900&auto=format&fit=crop'
    ],
    desc: 'A refined retreat with warm wood tones and a private balcony overlooking the gardens. Perfect for couples or solo travelers wanting a touch of quiet luxury.',
    amenities: ['Air Conditioning', 'Free WiFi', 'Smart TV', 'Breakfast Included', 'Mini Bar', 'Rain Shower'],
    checkIn: '2:00 PM',
    checkOut: '11:00 AM'
  },
  {
    id: 'standard-room',
    name: 'Standard Room',
    type: 'Standard',
    price: 129,
    rating: 4.5,
    reviews: 318,
    guests: 2,
    bed: 'Double Bed',
    size: '24 m²',
    available: true,
    img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=900&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=900&auto=format&fit=crop'
    ],
    desc: 'Comfortable and bright, the Standard Room offers everything you need for a relaxed stay, with thoughtful touches and easy access to all hotel facilities.',
    amenities: ['Air Conditioning', 'Free WiFi', 'Smart TV', 'Breakfast Included', 'Work Desk'],
    checkIn: '2:00 PM',
    checkOut: '11:00 AM'
  },
  {
    id: 'family-suite',
    name: 'Family Suite',
    type: 'Suite',
    price: 269,
    rating: 4.8,
    reviews: 156,
    guests: 4,
    bed: '2 Queen Beds',
    size: '48 m²',
    available: true,
    img: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=900&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576675784201-0e142b423952?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=900&auto=format&fit=crop'
    ],
    desc: 'A spacious two-room suite designed for families, with a separate living area, child-friendly amenities, and plenty of room to unwind together.',
    amenities: ['Air Conditioning', 'Free WiFi', 'Smart TV', 'Breakfast Included', 'Mini Kitchen', 'Sofa Bed'],
    checkIn: '2:00 PM',
    checkOut: '12:00 PM'
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    type: 'Suite',
    price: 349,
    rating: 4.9,
    reviews: 98,
    guests: 2,
    bed: 'King Bed',
    size: '54 m²',
    available: true,
    img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=900&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591084728795-1149f32d9866?q=80&w=900&auto=format&fit=crop'
    ],
    desc: 'Designed for the discerning traveler, with a dedicated workspace, lounge seating, and panoramic city views from a private corner balcony.',
    amenities: ['Air Conditioning', 'Free WiFi', 'Smart TV', 'Breakfast Included', 'Lounge Access', 'Mini Bar'],
    checkIn: '1:00 PM',
    checkOut: '12:00 PM'
  },
  {
    id: 'presidential-suite',
    name: 'Presidential Suite',
    type: 'Suite',
    price: 599,
    rating: 5.0,
    reviews: 42,
    guests: 4,
    bed: 'King Bed + Sofa Bed',
    size: '86 m²',
    available: false,
    img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=900&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551776235-dde6d482980b?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611891487122-207579d67d98?q=80&w=900&auto=format&fit=crop'
    ],
    desc: 'The pinnacle of Aurelia & Bay hospitality — a private terrace, personal butler service, and uninterrupted views over the bay. Reserved for unforgettable occasions.',
    amenities: ['Air Conditioning', 'Free WiFi', 'Smart TV', 'Breakfast Included', 'Private Terrace', 'Butler Service'],
    checkIn: '1:00 PM',
    checkOut: '1:00 PM'
  },
  {
    id: 'twin-room',
    name: 'Twin Room',
    type: 'Standard',
    price: 149,
    rating: 4.4,
    reviews: 187,
    guests: 2,
    bed: '2 Single Beds',
    size: '26 m²',
    available: true,
    img: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=900&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=900&auto=format&fit=crop'
    ],
    desc: 'Ideal for friends or colleagues traveling together, the Twin Room pairs two comfortable single beds with the same understated elegance found throughout the hotel.',
    amenities: ['Air Conditioning', 'Free WiFi', 'Smart TV', 'Breakfast Included', 'Work Desk'],
    checkIn: '2:00 PM',
    checkOut: '11:00 AM'
  }
];

const TESTIMONIALS = [
  {
    name: 'Helena Marchetti',
    loc: 'Milan, Italy',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    quote: 'Every detail felt considered. The staff anticipated things we didn\u2019t even know we needed. We are already planning our return.'
  },
  {
    name: 'James Whitfield',
    loc: 'London, UK',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    quote: 'The Executive Suite view alone is worth the trip. Breakfast on the terrace became the highlight of our mornings.'
  },
  {
    name: 'Aiko Tanaka',
    loc: 'Kyoto, Japan',
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    quote: 'Quiet, elegant, and impeccably run. The spa treatment after a long flight was exactly what we needed.'
  }
];

const FACILITIES = [
  { ic: 'fa-dumbbell', label: 'Gym' },
  { ic: 'fa-spa', label: 'Spa' },
  { ic: 'fa-utensils', label: 'Restaurant' },
  { ic: 'fa-martini-glass', label: 'Bar' },
  { ic: 'fa-people-roof', label: 'Conference Hall' },
  { ic: 'fa-square-parking', label: 'Parking' },
  { ic: 'fa-person-swimming', label: 'Swimming Pool' },
  { ic: 'fa-shirt', label: 'Laundry' }
];

const WHY_CHOOSE_US = [
  { ic: 'fa-crown', title: 'Luxury Rooms', desc: 'Thoughtfully designed spaces with premium linens, curated furnishings, and calming light.' },
  { ic: 'fa-wifi', title: 'Free WiFi', desc: 'High-speed connectivity throughout the property, included with every stay.' },
  { ic: 'fa-person-swimming', title: 'Swimming Pool', desc: 'A heated infinity pool overlooking the bay, open year-round.' },
  { ic: 'fa-utensils', title: 'Restaurant', desc: 'Seasonal, locally-sourced menus from our in-house culinary team.' },
  { ic: 'fa-plane-arrival', title: 'Airport Pickup', desc: 'Complimentary chauffeur service arranged around your flight time.' },
  { ic: 'fa-concierge-bell', title: '24/7 Reception', desc: 'Round-the-clock concierge support, whatever the hour.' }
];

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=900&auto=format&fit=crop', cat: 'rooms', tall: true, label: 'Deluxe Room' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=900&auto=format&fit=crop', cat: 'pool', tall: false, label: 'Infinity Pool' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=900&auto=format&fit=crop', cat: 'restaurant', tall: true, label: 'Main Dining Room' },
  { src: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=900&auto=format&fit=crop', cat: 'lobby', tall: false, label: 'Grand Lobby' },
  { src: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=900&auto=format&fit=crop', cat: 'rooms', tall: false, label: 'Family Suite' },
  { src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=900&auto=format&fit=crop', cat: 'events', tall: true, label: 'Garden Reception' },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=900&auto=format&fit=crop', cat: 'rooms', tall: false, label: 'Suite Bathroom' },
  { src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=900&auto=format&fit=crop', cat: 'restaurant', tall: false, label: 'Rooftop Bar' },
  { src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=900&auto=format&fit=crop', cat: 'rooms', tall: true, label: 'Executive Suite' },
  { src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=900&auto=format&fit=crop', cat: 'pool', tall: false, label: 'Poolside Lounge' },
  { src: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?q=80&w=900&auto=format&fit=crop', cat: 'lobby', tall: true, label: 'Reception Lounge' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=900&auto=format&fit=crop', cat: 'events', tall: false, label: 'Conference Hall' }
];

const TEAM = [
  { name: 'Marco Bellini', role: 'General Manager', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
  { name: 'Sofia Bianchi', role: 'Head Concierge', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Daniel Cho', role: 'Executive Chef', photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=400&auto=format&fit=crop' },
  { name: 'Priya Nair', role: 'Spa Director', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop' }
];

const TIMELINE = [
  { yr: '2011', text: 'Aurelia & Bay opens its doors with 40 rooms and a single restaurant overlooking the harbor.' },
  { yr: '2015', text: 'Expansion adds the east wing, the spa, and our first rooftop bar.' },
  { yr: '2019', text: 'Recognized among the region\u2019s top boutique hotels for service excellence.' },
  { yr: '2023', text: 'Full renovation of all suites, with a renewed focus on sustainable luxury.' },
  { yr: '2026', text: 'Now welcoming guests from over 60 countries each year, with 120 rooms across the property.' }
];

const FAQS = [
  { q: 'What time is check-in and check-out?', a: 'Standard check-in begins at 2:00 PM and check-out is by 11:00 AM. Suite categories often allow earlier check-in or later check-out — see each room\u2019s details page for specifics, or ask our concierge.' },
  { q: 'Is breakfast included in the room rate?', a: 'Yes, a full breakfast is included with every room category, served in the main restaurant or, for suites, available as in-room dining.' },
  { q: 'Can I cancel or modify my reservation?', a: 'Reservations can be modified or cancelled free of charge up to 48 hours before your check-in date. Within 48 hours, the first night\u2019s rate applies.' },
  { q: 'Do you offer airport transfers?', a: 'Complimentary airport pickup is available for all guests — just share your flight details with our concierge team after booking.' },
  { q: 'Is parking available on-site?', a: 'Yes, secure on-site parking is available to all guests at no additional charge, including valet service.' }
];
