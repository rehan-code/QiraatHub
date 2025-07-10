export interface Book {
  slug: string;
  title: string;
  author?: string;
  coverImage?: string;
  description?: string;
  downloadUrl: string;
  category: string;
}

export const books: Book[] = [
  {
    slug: 'mushaf-hisham-an-ibn-amir',
    title: 'Mushaf Hisham An Ibn Amir',
    author: 'Hisham an Ibn Amir',
    coverImage: '/books/Mushaf Hisham an Ibn Amir Cover.png',
    downloadUrl: 'https://pub-1d49f8f3e93f443db1361604407c9670.r2.dev/Mushaf%20Hisham%20an%20Ibn%20Amir.pdf',
    category: 'Quran',
  },
  {
    slug: 'mushaf-ibn-dhakwan-an-ibn-amir',
    title: 'Mushaf Ibn Dhakwan an Ibn Amir',
    author: 'Ibn Dhakwan an Ibn Amir',
    coverImage: '/books/Mushaf Ibn Dhakwan an Ibn Amir Cover.png',
    downloadUrl: 'https://pub-1d49f8f3e93f443db1361604407c9670.r2.dev/Mushaf%20Ibn%20Dhakwan%20an%20Ibn%20Amir.pdf',
    category: 'Quran',
  },
  {
    slug: 'mushaf-mushaf-qaloon-an-nafi',
    title: 'Mushaf Mushaf Qaloon an Nafi',
    author: 'Mushaf Qaloon an Nafi',
    coverImage: '/books/Mushaf Qaloon an Nafi Cover.png',
    downloadUrl: 'https://pub-1d49f8f3e93f443db1361604407c9670.r2.dev/Mushaf%20Qaloon%20an%20Nafi.pdf',
    description: 'Following Qalun\'s default method of Qasr (shortening) munfasil and sukoon (iskaan) meem al jam',
    category: 'Quran',
  },
  {
    slug: 'mushaf-warsh-an-nafi-azraq',
    title: 'Mushaf Warsh An Nafi Azraq',
    author: 'Nafi Azraq',
    coverImage: '/books/Mushaf Warsh An Nafi Azraq Cover.png',
    downloadUrl: 'https://pub-1d49f8f3e93f443db1361604407c9670.r2.dev/Mushaf%20Warsh%20an%20Nafi%20Azraq.pdf',
    description: 'Following the sub-riwayah or "Tariq" Al Azraq, one of Warsh\'s two main transmission paths alongside Al-Asbahani',
    category: 'Quran',
  },
  {
    slug: 'mushaf-warsh-an-nafi-asbahani',
    title: 'Mushaf Warsh An Nafi Asbahani',
    author: 'Nafi Asbahani',
    coverImage: 'https://www.alwa7y.com/downloads/asbhany.jpg',
    downloadUrl: 'http://www.alwa7y.com/downloads/TayseerWarshAsbhany.pdf',
    category: 'Quran',
  },
  {
    slug: 'al-shatibiyyah-english',
    title: 'Al-Shatibiyyah (English)',
    author: 'Imam Al-Qasim ibn Firruh ibn Khalaf ibn Ahmad ibn Al-Ruayni Al-Shatibi',
    downloadUrl: '/books/Shaatbiyyah-English.pdf',
    category: 'Book',
    description: `غُنْبَةُ الطَّلَبَة ف تَيْسِيرَ السَّبْعَة By Muhammad Saleem Gaibie

This book is based on al-Fawa'id al-Muhibbiyah, authored by Qari Anis Ahmad`,
  },
  {
    slug: 'al-durra-al-mudhiyyah',
    title: 'Al-Durra Al-Mudhiyyah',
    author: 'Ibn al-Jazari',
    downloadUrl: '/books/AlDurrah.pdf',
    category: 'Book',
    description: 'Completing the Canonical Ten',
  }
];
