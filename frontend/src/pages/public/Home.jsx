import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { useRef } from 'react';

const Home = () => {
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/hostel-hero.jpg"
            alt="USM Hostel"
            className="w-full h-full object-cover scale-110 animate-subtle-zoom"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-purple-800/30 to-purple-900/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-transparent to-black/60" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-left animate-fade-in-up">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                style={{
                  textShadow:
                    '3px 3px 12px rgba(0,0,0,0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
                }}
              >
                Your Comfort
                <br />
                Matters
              </h1>
              <div
                className="w-20 sm:w-24 h-1 bg-yellow-400 mb-6 sm:mb-8"
                style={{
                  boxShadow: '0 0 20px rgba(250, 204, 21, 0.6)',
                  animation: 'shimmer 2s ease-in-out infinite',
                }}
              />
              <p
                className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 sm:mb-10 leading-relaxed max-w-xl animate-fade-in-up animate-delay-100"
                style={{
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                Report hostel issues fast and
                <br className="hidden sm:inline" /> get solutions faster
              </p>
              <div className="mb-8 sm:mb-12 animate-fade-in-up animate-delay-200">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-auto"
                  style={{
                    animation: 'buttonPulse 2s ease-in-out infinite',
                  }}
                  asChild
                >
                  <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
                    REPORT ISSUE NOW
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block relative animate-fade-in-right animate-delay-300"></div>
          </div>
        </div>
      </section>

      {/* Student Life Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
            {/* Text Content - Left Side */}
            <div className="order-2 md:order-1 animate-fade-in-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 sm:mb-10 leading-tight">
                Your Comfort is Our Priority
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-10 sm:mb-12 leading-relaxed">
                Living in USM hostels should be comfortable and worry-free.
                DesaFix ensures every student has a voice when it comes to
                maintaining quality living conditions.
              </p>
              <ul className="space-y-6 sm:space-y-8 mb-10 sm:mb-12">
                <li className="flex items-start gap-4 sm:gap-5 group cursor-pointer transition-all duration-300 hover:translate-x-2 animate-fade-in-left animate-delay-100">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-600 rounded-full border-2 border-yellow-400 flex-shrink-0 mt-1 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"></div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl sm:text-2xl mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      Quick Help When You Need It
                    </div>
                    <div className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      Report problems and get help fast
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-4 sm:gap-5 group cursor-pointer transition-all duration-300 hover:translate-x-2 animate-fade-in-left animate-delay-200">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-600 rounded-full border-2 border-yellow-400 flex-shrink-0 mt-1 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"></div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl sm:text-2xl mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      Know What's Happening
                    </div>
                    <div className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      See updates on your repair requests
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-4 sm:gap-5 group cursor-pointer transition-all duration-300 hover:translate-x-2 animate-fade-in-left animate-delay-300">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-600 rounded-full border-2 border-yellow-400 flex-shrink-0 mt-1 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"></div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl sm:text-2xl mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      Easy to Use
                    </div>
                    <div className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      Simple process from start to finish
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Video Content - Right Side */}
            <div className="relative order-1 md:order-2 animate-fade-in-right">
              <div className="rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-300 hover:scale-[1.02]">
                {/* Local Video - Click to Play/Pause, No Visible Controls */}
                <div
                  className="relative aspect-[4/3] w-full bg-gray-900 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={handleVideoClick}
                >
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/student-section.jpg"
                  >
                    <source src="/student-life-video.mp4" type="video/mp4" />
                    {/* Fallback image if video doesn't load */}
                    <img
                      src="/student-section.jpg"
                      alt="USM Hostel Life"
                      className="w-full h-full object-cover"
                    />
                  </video>

                  {/* Subtle hover effect to indicate it's clickable */}
                  <div className="absolute inset-0 bg-transparent transition-all duration-300 hover:bg-black hover:bg-opacity-10" />
                </div>
              </div>

              {/* Floating FAQ Card */}
              <div className="absolute -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 bg-white rounded-xl shadow-2xl p-5 sm:p-7 max-w-[240px] sm:max-w-sm transform transition-all duration-300 hover:scale-105 animate-fade-in-up animate-delay-500">
                <div>
                  <div className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                    Have Questions?
                  </div>
                  <Link
                    to="/faq"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-sm sm:text-base text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-3 group"
                  >
                    Visit our FAQ
                    <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-yellow-400 flex items-center justify-center group-hover:bg-purple-700 transition-all duration-300 group-hover:translate-x-1">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/feature.jpg"
            alt="Community support features"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-purple-900/5" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up text-gray-900 dark:text-white">
              How DesaFix Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-800 border-l-4 border-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] animate-fade-in-up animate-delay-100">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                    STUDENT REPORTS
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-justify">
                  Students fill out a simple form describing their hostel
                  facility issue with photos and details
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-800 border-l-4 border-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] animate-fade-in-up animate-delay-200">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                    ADMIN ASSIGNS
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-justify">
                  Admins review complaints and assign them to maintenance staff
                  based on expertise, workload, and issue type
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-800 border-l-4 border-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] animate-fade-in-up animate-delay-300">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                    STAFF RESOLVES
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-justify">
                  Maintenance staff update complaint status, provides remarks,
                  and mark issues as resolved once fixed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
