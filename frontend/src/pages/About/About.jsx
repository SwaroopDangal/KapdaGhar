import { Card, CardContent } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              About Us
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <CardContent className="p-12">
            <div className="space-y-8">
              {/* Welcome Message */}
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <p className="text-xl leading-relaxed text-gray-700 pl-8">
                  Welcome to{" "}
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Kapda Pasal
                  </span>{" "}
                  — your trusted online destination for quality products that
                  bring joy to your everyday life.
                </p>
              </div>

              {/* Mission Statement */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  At{" "}
                  <span className="font-semibold text-blue-600">
                    Kapda Pasal
                  </span>
                  , we're passionate about delivering the best value and
                  customer experience. Whether you're shopping for daily
                  essentials or searching for that perfect gift, we're here to
                  make your journey delightful and memorable.
                </p>
              </div>

              {/* Values Section */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl">Q</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quality</h3>
                  <p className="text-sm text-gray-600">
                    Premium products you can trust
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Value</h3>
                  <p className="text-sm text-gray-600">
                    Best prices for best products
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-150 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Service</h3>
                  <p className="text-sm text-gray-600">
                    Exceptional customer care
                  </p>
                </div>
              </div>

              {/* Thank You Message */}
              <div className="text-center py-8">
                <div className="inline-block p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <p className="text-xl font-medium mb-2">
                    Thank you for supporting local businesses
                  </p>
                  <p className="text-lg opacity-90">
                    We're proud to serve you and be part of your journey! 🎉
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
