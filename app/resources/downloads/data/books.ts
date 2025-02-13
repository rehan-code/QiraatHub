export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  downloadUrl: string;
  category: string;
}

export const books: Book[] = [
  {
    id: '1',
    title: 'Mushaf Warsh An Nafi Asbahani',
    author: '',
    coverImage: 'https://www.alwa7y.com/downloads/asbhany.jpg',
    description: '',
    downloadUrl: 'http://www.alwa7y.com/downloads/TayseerWarshAsbhany.pdf',
    category: 'Quran'
  },
];
