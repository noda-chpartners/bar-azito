export const site = {
  name: 'barAZITO',
  alternateName: 'bar AZITO',
  title: 'barAZITO｜宮崎市上野町のバー',
  description:
    '宮崎市上野町のバー「barAZITO」。営業時間は21時から翌朝5時、定休日は不定休。宮崎駅から徒歩18分、Retro上野町ビル2F、全28席。',
  phoneDisplay: '090-1923-6404',
  phoneTel: '09019236404',
  instagramHandle: '@bar_azito.miyazaki',
  instagramUrl: 'https://www.instagram.com/bar_azito.miyazaki/',
  region: '宮崎県',
  city: '宮崎市',
  street: '上野町8-25',
  building: 'Retro上野町ビル 2F',
  station: '宮崎駅',
  walk: '徒歩18分',
  hours: '21:00 – 05:00',
  hoursNote: '平日 / 土日祝',
  closed: '不定休',
  seats: '28席',
} as const;

export const nav = [
  { href: '#concept', label: '紹介', en: 'Concept', index: '01' },
  { href: '#space', label: '店内', en: 'Space', index: '02' },
  { href: '#drink', label: 'ドリンク', en: 'Drink', index: '03' },
  { href: '#access', label: 'アクセス', en: 'Access', index: '04' },
] as const;

export const addressInline = `${site.region}${site.city}${site.street} ${site.building}`;

const query = encodeURIComponent(addressInline);

export const mapLink = `https://www.google.com/maps/search/?api=1&query=${query}`;
export const mapEmbed = `https://maps.google.com/maps?q=${query}&hl=ja&z=16&output=embed`;
