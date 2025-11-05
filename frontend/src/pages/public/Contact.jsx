import PublicLayout from '@/components/layout/PublicLayout';

const Contact = () => {
  const hostels = [
    { 
      name: 'Aman Damai', 
      phone: '04-653 3203',
      location: 'Desasiswa Aman Damai K01, Universiti Sains Malaysia, 11700 Gelugor, Penang',
      image: '/desa-aman-damai.jpg'
    },
    { 
      name: 'Fajar Harapan', 
      phone: '04-653 3626',
      location: 'Desasiswa Fajar Harapan F26, Universiti Sains Malaysia, Jalan Universiti, 11800 Gelugor, Penang',
      image: '/desa-fajar-harapan.jpg'
    },
    { 
      name: 'Bakti Permai', 
      phone: '04-653 3192',
      location: 'Desasiswa Bakti Permai H16, Universiti Sains Malaysia, University of Science Malaysia Blok H16, Jalan Tadika, 11800 Gelugor, Penang',
      image: '/desa-bakti-permai.jpg'
    },
    { 
      name: 'Cahaya Gemilang', 
      phone: '04-653 3339',
      location: 'Desasiswa Cahaya Gemilang, Banggunan H33, Jalan Gemilang, 11800 USM, Penang',
      image: '/desa-cahaya-gemilang.jpg'
    },
    { 
      name: 'Indah Kembara', 
      phone: '04-653 2489',
      location: 'Desasiswa Indah Kembara, Universiti Sains Malaysia, Desa Universiti, Jalan Sungai Dua, 11700 Gelugor, Penang',
      image: '/desa-indah-kembara.jpg'
    },
    { 
      name: 'Restu', 
      phone: '04-653 4465',
      location: 'Desasiswa Restu M01, USM, Halaman Bukit Gambir 4, 11700 Gelugor, Pulau Pinang',
      image: '/desa-restu.jpg'
    },
    { 
      name: 'Saujana', 
      phone: '04-653 4463',
      location: 'Pejabat Desasiswa Saujana, Blok M07 Kompleks RST, 11800 Minden, Pulau Pinang',
      image: '/desa-saujana.jpg'
    },
    { 
      name: 'Tekun', 
      phone: '04-653 4453',
      location: 'Desasiswa Tekun M05 USM, Halaman Bukit Gambir 4, 11700 Gelugor, Penang',
      image: '/desa-tekun.jpg'
    },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            {/* Hostels Grid */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">USM Hostels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] bg-white"
                  >
                    {/* Hostel Image */}
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={hostel.image} 
                        alt={hostel.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/hostel-placeholder.jpg'; // Fallback image
                        }}
                      />
                    </div>
                    
                    {/* Hostel Info */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-purple-600 mb-4">{hostel.name}</h3>
                      
                      {/* Contact Information */}
                      <div className="space-y-4">
                        {/* Phone Number */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Phone Number</h4>
                          <p className="text-sm text-gray-600">{hostel.phone}</p>
                        </div>
                        
{/* Location */}
<div>
  <h4 className="text-sm font-semibold text-gray-800 mb-1">Location</h4>
  <p className="text-sm text-gray-600 leading-relaxed text-justify">{hostel.location}</p>
</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;