import PublicLayout from '@/components/layout/PublicLayout';

const AboutUs = () => {
  const hostels = [
    { name: 'Desa Ilmu', location: 'Main Campus', capacity: '500 students' },
    { name: 'Desa Tekun', location: 'Main Campus', capacity: '450 students' },
    { name: 'Desa Cahaya', location: 'Main Campus', capacity: '400 students' },
    { name: 'Desa Bistari', location: 'Main Campus', capacity: '480 students' },
    { name: 'Desa Siswa', location: 'Engineering Campus', capacity: '350 students' },
    { name: 'Desa Mahasiswa', location: 'Health Campus', capacity: '300 students' },
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About DesaFix</h1>
          <p className="text-lg text-gray-700 mb-8">
            DesaFix is a centralized platform designed to help USM students report 
            and track hostel facility issues efficiently. Our mission is to ensure 
            comfortable living conditions across all campus hostels.
          </p>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">USM Hostels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hostels.map((hostel, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-purple-600 mb-2">{hostel.name}</h3>
                  <p className="text-gray-600 mb-1"><strong>Location:</strong> {hostel.location}</p>
                  <p className="text-gray-600"><strong>Capacity:</strong> {hostel.capacity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutUs;