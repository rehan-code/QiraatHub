import { notFound } from "next/navigation";
import Image from "next/image";

interface Scholar {
  name: string;
  image: string;
  slug: string;
  description: string;
  earlyLife: string;
  didYouKnow: string[];
  transmission: {
    name: string;
    details: string;
  }[];
  resources: {
    title: string;
    url: string;
  }[];
  youtubeVideos: {
    title: string;
    url: string;
  }[];
}

const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const scholars: Scholar[] = [
  {
    name: "Nafi' al-Madani",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran_read20-1280x640-1-768x384.jpg",
    slug: "nafi-al-madani",
    description: "Nafi' al-Madani was one of the most prominent scholars of Qira'at in Madinah. He learned the Quran from 70 of the Tabi'in who had learned from the Companions of the Prophet ﷺ.",
    earlyLife: "Born around 70 AH in Madinah, Nafi' grew up in an environment rich with Islamic knowledge. He dedicated his early years to the study of the Quran under the guidance of numerous scholars who had direct connections to the companions of the Prophet ﷺ.",
    didYouKnow: [
      "He served as the Imam of Qira'at in Madinah for over 70 years",
      "His reading was adopted as the official reading of Madinah",
      "Imam Malik said about him: 'The recitation of the people of Madinah is the Sunnah'"
    ],
    transmission: [
      {
        name: "Qalun",
        details: "One of the primary transmitters of Nafi's Qira'at, known for his precise recitation"
      },
      {
        name: "Warsh",
        details: "Another main transmitter who spread Nafi's reading throughout North Africa"
      }
    ],
    resources: [
      {
        title: "Mushaf Qaloon An Nafi Shatibiyyah",
        url: "https://example.com/nafi-introduction.pdf"
      },
      {
        title: "Mushaf Qaloon An Nafi Shatibiyyah",
        url: "https://example.com/nafi-introduction.pdf"
      },
      {
        title: "Mushaf Qaloon An Nafi Shatibiyyah",
        url: "https://example.com/nafi-introduction.pdf"
      },
    ],
    youtubeVideos: [
      {
        title: "Surah Yusuf",
        url: "https://youtu.be/BqHgoRTL6xU"
      },
      {
        title: "Surah Kahf",
        url: "https://youtu.be/e4KV44rhNYo"
      }
    ]
  },
  {
    name: "Ibn Kathir",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran-islam-laptop-wallpaper-6114872-1-768x512.jpg",
    slug: "ibn-kathir",
    description: "Ibn Kathir al-Makki was born in Makkah in 45 AH and passed away in 120 AH. He was one of the most respected readers of the Quran in Makkah and was known for his precise and authentic transmission.",
    earlyLife: "Born in Makkah, Ibn Kathir grew up in a family of scholars and was known for his exceptional memory and recitation skills from a young age.",
    didYouKnow: [
      "Appointed as the leading Quran teacher in Makkah",
      "Developed a distinct style of recitation",
      "His reading became the standard in Makkah"
    ],
    transmission: [
      {
        name: "Al-Bazzi",
        details: "One of the primary transmitters of Ibn Kathir's Qira'at, known for his precise recitation"
      },
      {
        name: "Qunbul",
        details: "Another main transmitter who spread Ibn Kathir's reading throughout the Arabian Peninsula"
      }
    ],
    resources: [
      {
        title: "Introduction to Ibn Kathir's Qira'at",
        url: "https://example.com/ibn-kathir-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Ibn Kathir's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  },
  {
    name: "Abu Amr Basri",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/book-quran-open-1283468-1-768x512.jpg",
    slug: "abu-amr-basri",
    description: "Abu Amr al-Basri was born in 68 AH and passed away in 154 AH. He was renowned for his extensive knowledge of Arabic language and Quranic sciences.",
    earlyLife: "Born in Basra, Abu Amr grew up in a family of scholars and was known for his exceptional knowledge of Arabic language and Quranic sciences from a young age.",
    didYouKnow: [
      "Established a prominent school of Qira'at in Basra",
      "Authored several works on Arabic grammar",
      "His reading was widely accepted in both Basra and Baghdad"
    ],
    transmission: [
      {
        name: "Al-Duri",
        details: "One of the primary transmitters of Abu Amr's Qira'at, known for his precise recitation"
      },
      {
        name: "Al-Susi",
        details: "Another main transmitter who spread Abu Amr's reading throughout the Middle East"
      }
    ],
    resources: [
      {
        title: "Introduction to Abu Amr's Qira'at",
        url: "https://example.com/abu-amr-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Abu Amr's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  },
  {
    name: "Ibn Amir Shami",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran-islam-book-6862296-1-768x512.jpg",
    slug: "ibn-amir-shami",
    description: "Ibn Amir ash-Shami was the leading Qari of Greater Syria (Ash-Sham). He was born in 21 AH and passed away in 118 AH. He was appointed as the Grand Judge of Damascus.",
    earlyLife: "Born in Damascus, Ibn Amir grew up in a family of scholars and was known for his exceptional knowledge of Quranic sciences from a young age.",
    didYouKnow: [
      "Chief Judge of Damascus",
      "His reading became the standard in the Levant region",
      "Taught numerous prominent scholars"
    ],
    transmission: [
      {
        name: "Hisham",
        details: "One of the primary transmitters of Ibn Amir's Qira'at, known for his precise recitation"
      },
      {
        name: "Ibn Dhakwan",
        details: "Another main transmitter who spread Ibn Amir's reading throughout the Levant region"
      }
    ],
    resources: [
      {
        title: "Introduction to Ibn Amir's Qira'at",
        url: "https://example.com/ibn-amir-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Ibn Amir's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  },
  {
    name: "Asim Al Koofi",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/an-quran-scripture-7741928-1-768x513.jpg",
    slug: "asim-al-koofi",
    description: "Asim al-Kufi was one of the most influential Qurra of Kufa. He passed away around 127 AH. His reading is one of the most widely spread today through the narration of Hafs.",
    earlyLife: "Born in Kufa, Asim grew up in a family of scholars and was known for his exceptional knowledge of Quranic sciences from a young age.",
    didYouKnow: [
      "Developed the most widely used Qira'at today",
      "Known for his exceptional memory and precision",
      "Established a major school of Quranic recitation in Kufa"
    ],
    transmission: [
      {
        name: "Hafs",
        details: "One of the primary transmitters of Asim's Qira'at, known for his precise recitation"
      },
      {
        name: "Shu'bah",
        details: "Another main transmitter who spread Asim's reading throughout the Middle East"
      }
    ],
    resources: [
      {
        title: "Introduction to Asim's Qira'at",
        url: "https://example.com/asim-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Asim's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  },
  {
    name: "Hamza Al Kufi",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/book-quran-scripture-8224121-1-768x512.png",
    slug: "hamza-al-kufi",
    description: "Hamza al-Kufi was born in 80 AH and passed away in 156 AH. He was known for his expertise in Arabic language and Quranic recitation.",
    earlyLife: "Born in Kufa, Hamza grew up in a family of scholars and was known for his exceptional knowledge of Arabic language and Quranic sciences from a young age.",
    didYouKnow: [
      "Renowned for his knowledge of Arabic and Quranic sciences",
      "Developed unique recitation methods",
      "Established a prominent school of Qira'at"
    ],
    transmission: [
      {
        name: "Khalaf",
        details: "One of the primary transmitters of Hamza's Qira'at, known for his precise recitation"
      },
      {
        name: "Khallad",
        details: "Another main transmitter who spread Hamza's reading throughout the Middle East"
      }
    ],
    resources: [
      {
        title: "Introduction to Hamza's Qira'at",
        url: "https://example.com/hamza-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Hamza's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  },
  {
    name: "Al-Kisa'i",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran-light-spirituality-5385907-1-2-768x512.jpg",
    slug: "al-kisai",
    description: "Al-Kisa'i was one of the Seven Readers and a prominent scholar of Arabic grammar. He passed away in 189 AH. He was the leading grammarian of the Kufa school.",
    earlyLife: "Born in Kufa, Al-Kisa'i grew up in a family of scholars and was known for his exceptional knowledge of Arabic language and Quranic sciences from a young age.",
    didYouKnow: [
      "Leading grammarian of the Kufa school",
      "Teacher of the sons of Caliph Harun ar-Rashid",
      "Authored numerous works on Arabic grammar"
    ],
    transmission: [
      {
        name: "Al-Layth",
        details: "One of the primary transmitters of Al-Kisa'i's Qira'at, known for his precise recitation"
      },
      {
        name: "Ad-Duri",
        details: "Another main transmitter who spread Al-Kisa'i's reading throughout the Middle East"
      }
    ],
    resources: [
      {
        title: "Introduction to Al-Kisa'i's Qira'at",
        url: "https://example.com/al-kisai-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Al-Kisa'i's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  },
  {
    name: "Abu Jaafar",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/quran-light-recite-5385901-1-1-768x512.jpg",
    slug: "abu-jaafar",
    description: "Abu Ja'far was one of the ten recognized Qurra. He was born in 70 AH and passed away in 130 AH. He was known for his precise and authentic transmission of the Quran.",
    earlyLife: "Born in Madinah, Abu Ja'far grew up in a family of scholars and was known for his exceptional knowledge of Quranic sciences from a young age.",
    didYouKnow: [
      "One of the earliest authorities on Quranic recitation in Madinah",
      "Developed distinct recitation methods",
      "Taught many prominent scholars"
    ],
    transmission: [
      {
        name: "Isa ibn Wardan",
        details: "One of the primary transmitters of Abu Ja'far's Qira'at, known for his precise recitation"
      },
      {
        name: "Ibn Jammaz",
        details: "Another main transmitter who spread Abu Ja'far's reading throughout the Arabian Peninsula"
      }
    ],
    resources: [
      {
        title: "Introduction to Abu Ja'far's Qira'at",
        url: "https://example.com/abu-jaafar-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Abu Ja'far's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  },
  {
    name: "Yaqub Hadrani",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/87948b6c923b69c5e451fcb5d3a5577a-1.webp",
    slug: "yaqub-hadrani",
    description: "Yaqub al-Hadrami was born in 117 AH and passed away in 205 AH. He was the leading Qari of Basra in his time.",
    earlyLife: "Born in Basra, Yaqub grew up in a family of scholars and was known for his exceptional knowledge of Quranic sciences from a young age.",
    didYouKnow: [
      "Imam of the Grand Mosque of Basra",
      "Developed unique recitation methods",
      "His reading was widely accepted in Basra"
    ],
    transmission: [
      {
        name: "Ruways",
        details: "One of the primary transmitters of Yaqub's Qira'at, known for his precise recitation"
      },
      {
        name: "Rawh",
        details: "Another main transmitter who spread Yaqub's reading throughout the Middle East"
      }
    ],
    resources: [
      {
        title: "Introduction to Yaqub's Qira'at",
        url: "https://example.com/yaqub-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Yaqub's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  },
  {
    name: "Khalaf Al Ashir",
    image: "https://qiraathub.com/wp-content/uploads/2024/09/i-768x768.webp",
    slug: "khalaf-al-ashir",
    description: "Khalaf was born in 150 AH and passed away in 229 AH. He was one of the transmitters of Hamza's reading before establishing his own reading.",
    earlyLife: "Born in Kufa, Khalaf grew up in a family of scholars and was known for his exceptional knowledge of Quranic sciences from a young age.",
    didYouKnow: [
      "Developed his own recognized reading",
      "Authored works on Quranic sciences",
      "Known for his expertise in both transmission and recitation"
    ],
    transmission: [
      {
        name: "Ishaq",
        details: "One of the primary transmitters of Khalaf's Qira'at, known for his precise recitation"
      },
      {
        name: "Idris",
        details: "Another main transmitter who spread Khalaf's reading throughout the Middle East"
      }
    ],
    resources: [
      {
        title: "Introduction to Khalaf's Qira'at",
        url: "https://example.com/khalaf-introduction.pdf"
      }
    ],
    youtubeVideos: [
      {
        title: "Learning Khalaf's Qira'at",
        url: "https://youtube.com/example"
      }
    ]
  }
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ScholarPage({ params }: PageProps) {
  const { slug } = await params;
  const scholar = scholars.find((s) => s.slug === slug);

  if (!scholar) {
    return <div>Scholar not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src={scholar.image}
          alt={scholar.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-3xl backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/20">
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight">{scholar.name}</h1>
                <p className="text-lg text-gray-200 leading-relaxed font-light">{scholar.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{scholar.transmission.length}</div>
              <div className="text-sm text-gray-600">Transmissions</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{scholar.resources.length}</div>
              <div className="text-sm text-gray-600">Resources</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{scholar.youtubeVideos.length}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Early Life Section */}
              <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Early Life and Legacy</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{scholar.earlyLife}</p>
            </section>

            {/* Did You Know Section */}
              <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Did You Know?</h2>
                <div className="space-y-6">
                {scholar.didYouKnow.map((fact, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-6 group"
                    >
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-all duration-300">
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                    </div>
                      <div className="flex-1 bg-blue-50/50 p-5 rounded-2xl">
                        <p className="text-lg text-gray-700">{fact}</p>
                      </div>
                  </div>
                ))}
              </div>
            </section>

              {/* Transmission Section */}
              <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Transmission</h2>
              <div className="grid gap-6">
                  {scholar.transmission.map((transmitter, index) => (
                    <div 
                      key={index} 
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                      <div className="relative p-4 bg-white rounded-xl">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h3 className="text-2xl font-bold text-gray-900">{transmitter.name}</h3>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed pl-6">{transmitter.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Resources Section */}
            <section className="bg-white rounded-2xl shadow-xl">
              <div className="p-6 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Resources</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {scholar.resources.map((resource, index) => (
                    <a 
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                        <div className="relative p-4 bg-white rounded-lg border border-gray-200 flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-500 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors duration-300">{resource.title}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Videos Section */}
            <section className="bg-white rounded-2xl shadow-xl">
              <div className="p-6 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Videos</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {scholar.youtubeVideos.map((video, index) => {
                    const videoId = getYouTubeVideoId(video.url);
                    return (
                      <div key={index} className="space-y-3">
                        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {video.title}
                          </h3>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                            title="Open in YouTube"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
