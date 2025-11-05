import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle, Search, ShieldCheck, ArrowRight, Star, Users, Zap } from 'lucide-react';
import { mockComplaints } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import PublicLayout from '@/components/layout/PublicLayout';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const totalComplaints = mockComplaints.length;
  const pendingComplaints = mockComplaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = mockComplaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = mockComplaints.filter(c => c.status === 'Resolved').length;

  const filteredComplaints = mockComplaints.filter(complaint =>
    complaint.facilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.issueDescription.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero Section - Enhanced with animations */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background hostel image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/hostel-hero.jpg"
            alt="USM Hostel"
            className="w-full h-full object-cover scale-110 animate-subtle-zoom"
            style={{
              animation: 'subtleZoom 20s ease-in-out infinite alternate'
            }}
          />
        </div>
        
        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-purple-800/30 to-purple-900/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-transparent to-black/60" />
        
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Main content */}
            <div 
              className={`text-left transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {/* Main heading - responsive sizing */}
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                style={{
                  textShadow: '3px 3px 12px rgba(0,0,0,0.5), 0 0 40px rgba(168, 85, 247, 0.3)'
                }}
              >
                Your Comfort<br />Matters
              </h1>
              
              {/* Divider line with animation */}
              <div 
                className="w-20 sm:w-24 h-1 bg-yellow-400 mb-6 sm:mb-8 transition-all duration-700"
                style={{
                  boxShadow: '0 0 20px rgba(250, 204, 21, 0.6)',
                  animation: 'shimmer 2s ease-in-out infinite'
                }}
              />
              
              {/* Subheading - responsive sizing */}
              <p 
                className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 sm:mb-10 leading-relaxed max-w-xl"
                style={{
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
                }}
              >
                Report hostel issues fast and<br className="hidden sm:inline" /> get solutions faster
              </p>

              {/* CTA button with pulse animation */}
              <div className="mb-8 sm:mb-12">
                <Button 
                  size="lg" 
                  className="bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  style={{
                    animation: 'buttonPulse 2s ease-in-out infinite'
                  }}
                  asChild
                >
                  <Link to="/login">
                    REPORT ISSUE NOW
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Floating stat cards - hidden on mobile, shown on lg+ */}
            <div 
              className={`hidden lg:block relative transition-all duration-1000 delay-300 transform ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
            </div>
          </div>

          {/* Mobile stats - shown only on mobile/tablet */}
          <div 
            className={`lg:hidden mt-8 sm:mt-12 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
          </div>
        </div>
      </section>

      {/* Student Life Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold text-xs sm:text-sm rounded-lg">
                  STUDENT LIFE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Your Comfort,<br />Our Priority
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Living in USM hostels should be comfortable and worry-free. DesaFix ensures every student has a voice when it comes to maintaining quality living conditions.
              </p>
              <ul className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900 text-base sm:text-lg">Fast Response Time</div>
                    <div className="text-sm sm:text-base text-gray-600">Average 24-hour response for urgent issues</div>
                  </div>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900 text-base sm:text-lg">Real-Time Tracking</div>
                    <div className="text-sm sm:text-base text-gray-600">Monitor your complaint status every step of the way</div>
                  </div>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900 text-base sm:text-lg">Direct Communication</div>
                    <div className="text-sm sm:text-base text-gray-600">Stay updated with notifications and feedback</div>
                  </div>
                </li>
              </ul>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 w-full sm:w-auto" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>

            <div className="relative mt-8 md:mt-0">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80" 
                  alt="USM Hostel Room"
                  className="w-full h-[350px] sm:h-[450px] lg:h-[500px] object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-[200px] sm:max-w-xs border border-gray-100">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">4.8/5</div>
                    <div className="text-xs sm:text-sm text-gray-600">Student Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">How DesaFix Works</h2>
            <p className="text-base sm:text-lg lg:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed px-4">
              Three simple steps to get your hostel issues resolved quickly and efficiently
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="text-center border-t-4 border-purple-600 pt-6 sm:pt-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">SUBMIT REPORT</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Fill out a simple form describing your hostel facility issue with photos and details
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <Eye className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="text-center border-t-4 border-purple-600 pt-6 sm:pt-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">TRACK STATUS</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Monitor real-time updates as admin team reviews and works on resolving your complaint
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="text-center border-t-4 border-purple-600 pt-6 sm:pt-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">GET RESOLVED</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Receive notifications when resolved and provide feedback to help improve services
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mx-auto mb-3 sm:mb-4" />
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{totalComplaints}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Reports</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 mx-auto mb-3 sm:mb-4" />
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{pendingComplaints}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Pending</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 mx-auto mb-3 sm:mb-4" />
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{inProgressComplaints}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">In Progress</div>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-3 sm:mb-4" />
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{resolvedComplaints}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Resolved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Search Recent Reports</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">Check if your issue has been reported before</p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                type="text" 
                placeholder="Search by facility type or description..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-12 sm:pl-16 h-12 sm:h-14 lg:h-16 bg-white border-2 border-gray-200 focus:border-purple-600 text-sm sm:text-base lg:text-lg rounded-xl shadow-sm"
              />
            </div>
          </div>

          {filteredComplaints.length > 0 && (
            <div className="max-w-4xl mx-auto mt-8 sm:mt-12 lg:mt-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                {searchTerm ? 'Search Results' : 'Recent Reports'}
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="bg-white border-2 border-gray-100 rounded-xl p-4 sm:p-6 lg:p-8 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-900">{complaint.facilityType}</h4>
                          <Badge 
                            className={
                              `text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg ${
                                complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                                complaint.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 
                                'bg-gray-100 text-gray-700'
                              }`
                            }
                          >
                            {complaint.status}
                          </Badge>
                        </div>
                        <p className="text-sm sm:text-base text-gray-500 mb-3">
                          {complaint.hostelName} • Room {complaint.roomNumber}
                        </p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{complaint.issueDescription}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of USM students using DesaFix to improve hostel living conditions
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold h-16 px-12 text-lg shadow-xl transition-all duration-300" asChild>
            <Link to="/login">
              Submit Your First Report
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;