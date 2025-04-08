export interface Book {
  id: string;
  title: string;
  author?: string;
  coverImage?: string;
  description?: string;
  downloadUrl: string;
  category: string;
}

export const books: Book[] = [
  {
    id: '1',
    title: 'Mushaf Warsh An Nafi Asbahani',
    author: 'Nafi Asbahani',
    coverImage: 'https://www.alwa7y.com/downloads/asbhany.jpg',
    downloadUrl: 'http://www.alwa7y.com/downloads/TayseerWarshAsbhany.pdf',
    category: 'Quran',
  },
  {
    id: '2',
    title: 'Al-Shatibiyyah (English)',
    author: 'Imam Al-Qasim ibn Firruh ibn Khalaf ibn Ahmad ibn Al-Ruayni Al-Shatibi',
    downloadUrl: '/books/Shaatbiyyah-English.pdf',
    category: 'Book',
    description: `غُنْبَةُ الطَّلَبَة ف تَيْسِيرَ السَّبْعَة By Muhammad Saleem Gaibie

This book is based on al-Fawa'id al-Muhibbiyah, authored by Qari Anis Ahmad`,
  },
  {
    id: '3',
    title: 'Al-Durra Al-Mudhiyyah',
    author: 'Ibn al-Jazari',
    downloadUrl: '/books/AlDurrah.pdf',
    category: 'Book',
    description: 'Completing the Canonical Ten',
  }
];
