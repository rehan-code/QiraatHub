import { notFound } from "next/navigation";
import Image from "next/image";

interface Scholar {
  name: string;
  image: string;
  slug: string;
  biography: string;
  achievements: string[];
  students: string[];
  teachers: string[];
}

const scholars: Scholar[] = [
  {
    name: "Nafi' al-Madani",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg",
    slug: "nafi-al-madani",
    biography: "Nafi' al-Madani was one of the most prominent scholars of Qira'at in Madinah. He was born around 70 AH and passed away in 169 AH. He learned the Quran from 70 of the Tabi'in who had learned from the Companions of the Prophet ﷺ.",
    achievements: [
      "Served as the Imam of Qira'at in Madinah",
      "Taught Qira'at for over 70 years",
      "His reading was adopted as the official reading of Madinah"
    ],
    students: ["Qalun", "Warsh", "Imam Malik"],
    teachers: ["Abu Ja'far", "Abd ar-Rahman ibn Hurmuz", "Muslim ibn Jundub"]
  },
  {
    name: "Ibn Kathir",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg",
    slug: "ibn-kathir",
    biography: "Ibn Kathir al-Makki was born in Makkah in 45 AH and passed away in 120 AH. He was one of the most respected readers of the Quran in Makkah and was known for his precise and authentic transmission.",
    achievements: [
      "Appointed as the leading Quran teacher in Makkah",
      "Developed a distinct style of recitation",
      "His reading became the standard in Makkah"
    ],
    students: ["Al-Bazzi", "Qunbul"],
    teachers: ["Abdullah ibn Sa'ib al-Makhzumi", "Mujahid ibn Jabr"]
  },
  {
    name: "Abu Amr Basri",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/book-quran-open-1283468-1-768x512.jpg",
    slug: "abu-amr-basri",
    biography: "Abu Amr al-Basri was born in 68 AH and passed away in 154 AH. He was renowned for his extensive knowledge of Arabic language and Quranic sciences.",
    achievements: [
      "Established a prominent school of Qira'at in Basra",
      "Authored several works on Arabic grammar",
      "His reading was widely accepted in both Basra and Baghdad"
    ],
    students: ["Al-Duri", "Al-Susi"],
    teachers: ["Mujahid ibn Jabr", "Sa'id ibn Jubayr"]
  },
  {
    name: "Ibn Amir Shami",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran-islam-book-6862296-1-768x512.jpg",
    slug: "ibn-amir-shami",
    biography: "Ibn Amir ash-Shami was the leading Qari of Greater Syria (Ash-Sham). He was born in 21 AH and passed away in 118 AH. He was appointed as the Grand Judge of Damascus.",
    achievements: [
      "Chief Judge of Damascus",
      "His reading became the standard in the Levant region",
      "Taught numerous prominent scholars"
    ],
    students: ["Hisham", "Ibn Dhakwan"],
    teachers: ["Al-Mughirah ibn Abi Shihab", "Abu ad-Darda"]
  },
  {
    name: "Asim Al Koofi",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg",
    slug: "asim-al-koofi",
    biography: "Asim al-Kufi was one of the most influential Qurra of Kufa. He passed away around 127 AH. His reading is one of the most widely spread today through the narration of Hafs.",
    achievements: [
      "Developed the most widely used Qira'at today",
      "Known for his exceptional memory and precision",
      "Established a major school of Quranic recitation in Kufa"
    ],
    students: ["Hafs", "Shu'bah"],
    teachers: ["Abu Abd ar-Rahman as-Sulami", "Zirr ibn Hubaysh"]
  },
  {
    name: "Hamza Al Kufi",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png",
    slug: "hamza-al-kufi",
    biography: "Hamza al-Kufi was born in 80 AH and passed away in 156 AH. He was known for his expertise in Arabic language and Quranic recitation.",
    achievements: [
      "Renowned for his knowledge of Arabic and Quranic sciences",
      "Developed unique recitation methods",
      "Established a prominent school of Qira'at"
    ],
    students: ["Khalaf", "Khallad"],
    teachers: ["Al-A'mash", "Humran ibn A'yan"]
  },
  {
    name: "Al-Kisa'i",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran-light-spirituality-5385907-1-2-768x512.jpg",
    slug: "al-kisai",
    biography: "Al-Kisa'i was one of the Seven Readers and a prominent scholar of Arabic grammar. He passed away in 189 AH. He was the leading grammarian of the Kufa school.",
    achievements: [
      "Leading grammarian of the Kufa school",
      "Teacher of the sons of Caliph Harun ar-Rashid",
      "Authored numerous works on Arabic grammar"
    ],
    students: ["Al-Layth", "Ad-Duri"],
    teachers: ["Hamza al-Kufi", "Shu'bah"]
  },
  {
    name: "Abu Jaafar",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran-light-recite-5385901-1-1-768x512.jpg",
    slug: "abu-jaafar",
    biography: "Abu Ja'far was one of the ten recognized Qurra. He was born in 70 AH and passed away in 130 AH. He was known for his precise and authentic transmission of the Quran.",
    achievements: [
      "One of the earliest authorities on Quranic recitation in Madinah",
      "Developed distinct recitation methods",
      "Taught many prominent scholars"
    ],
    students: ["Isa ibn Wardan", "Ibn Jammaz"],
    teachers: ["Abdullah ibn Abbas", "Abu Hurayrah"]
  },
  {
    name: "Yaqub Hadrani",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/87948b6c923b69c5e451fcb5d3a5577a-1.webp",
    slug: "yaqub-hadrani",
    biography: "Yaqub al-Hadrami was born in 117 AH and passed away in 205 AH. He was the leading Qari of Basra in his time.",
    achievements: [
      "Imam of the Grand Mosque of Basra",
      "Developed unique recitation methods",
      "His reading was widely accepted in Basra"
    ],
    students: ["Ruways", "Rawh"],
    teachers: ["Abu al-Mundhir Salam", "Mahdi ibn Maymun"]
  },
  {
    name: "Khalaf Al Ashir",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/i-768x768.webp",
    slug: "khalaf-al-ashir",
    biography: "Khalaf was born in 150 AH and passed away in 229 AH. He was one of the transmitters of Hamza's reading before establishing his own reading.",
    achievements: [
      "Developed his own recognized reading",
      "Authored works on Quranic sciences",
      "Known for his expertise in both transmission and recitation"
    ],
    students: ["Ishaq", "Idris"],
    teachers: ["Hamza al-Kufi", "Sulaym ibn Isa"]
  }
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ScholarPage({ params }: PageProps) {
  const { slug } = await params;
  const scholar = scholars.find((s) => s.slug === slug);

  if (!scholar) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <Image
            src={scholar.image}
            alt={scholar.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{scholar.name}</h1>
          </div>
        </div>

        {/* Biography Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Biography</h2>
          <p className="text-gray-700 leading-relaxed">{scholar.biography}</p>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notable Achievements</h2>
          <ul className="list-disc list-inside space-y-2">
            {scholar.achievements.map((achievement, index) => (
              <li key={index} className="text-gray-700">{achievement}</li>
            ))}
          </ul>
        </div>

        {/* Teachers & Students Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Teachers Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Teachers</h2>
            <ul className="list-disc list-inside space-y-2">
              {scholar.teachers.map((teacher, index) => (
                <li key={index} className="text-gray-700">{teacher}</li>
              ))}
            </ul>
          </div>

          {/* Students Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Students</h2>
            <ul className="list-disc list-inside space-y-2">
              {scholar.students.map((student, index) => (
                <li key={index} className="text-gray-700">{student}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
