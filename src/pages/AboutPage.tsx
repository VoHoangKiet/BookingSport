import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Target, Users, Shield, Zap, Heart, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Nền tảng đặt sân thể thao
              <span className="block text-emerald-600 mt-2">hàng đầu Việt Nam</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              BookingSport kết nối người chơi với hàng nghìn sân thể thao chất lượng cao, 
              giúp việc đặt sân trở nên dễ dàng, nhanh chóng và tiện lợi hơn bao giờ hết.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/courts">
                <Button size="lg" className="gap-2">
                  Tìm sân ngay <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Đăng ký miễn phí
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Target className="w-4 h-4" />
                Sứ mệnh của chúng tôi
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Kết nối đam mê thể thao
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Chúng tôi tin rằng thể thao là cầu nối tuyệt vời để mọi người kết nối, 
                rèn luyện sức khỏe và tạo nên những kỷ niệm đáng nhớ. BookingSport ra đời 
                với sứ mệnh làm cho việc tìm kiếm và đặt sân thể thao trở nên đơn giản nhất.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dễ dàng & Tiện lợi</h3>
                    <p className="text-gray-600">Đặt sân chỉ với vài cú click, mọi lúc mọi nơi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Đa dạng lựa chọn</h3>
                    <p className="text-gray-600">Hàng nghìn sân thể thao từ bóng đá, cầu lông đến tennis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Giá cả minh bạch</h3>
                    <p className="text-gray-600">Không phí ẩn, thanh toán an toàn qua VNPay</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-1">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl font-bold text-emerald-600 mb-2">17+</div>
                    <div className="text-xl text-gray-600 font-medium">Sân thể thao</div>
                    <div className="mt-8 text-5xl font-bold text-teal-600 mb-2">25+</div>
                    <div className="text-xl text-gray-600 font-medium">Người dùng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn BookingSport?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến trải nghiệm đặt sân tốt nhất với những tính năng vượt trội
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Đặt sân nhanh chóng</h3>
              <p className="text-gray-600 leading-relaxed">
                Giao diện thân thiện, quy trình đặt sân đơn giản chỉ trong vài phút. 
                Xem lịch trống và xác nhận ngay lập tức.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Thanh toán an toàn</h3>
              <p className="text-gray-600 leading-relaxed">
                Tích hợp cổng thanh toán VNPay uy tín, bảo mật thông tin tuyệt đối. 
                Hỗ trợ đặt cọc và thanh toán linh hoạt.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cộng đồng lớn mạnh</h3>
              <p className="text-gray-600 leading-relaxed">
                Kết nối với hàng nghìn người chơi cùng đam mê. Tìm đối thủ, 
                tổ chức giải đấu và chia sẻ niềm vui thể thao.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sân chất lượng cao</h3>
              <p className="text-gray-600 leading-relaxed">
                Tất cả sân đều được kiểm duyệt kỹ lưỡng, đảm bảo tiêu chuẩn chất lượng. 
                Hình ảnh thực tế, đánh giá từ người dùng.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hỗ trợ tận tâm</h3>
              <p className="text-gray-600 leading-relaxed">
                Đội ngũ chăm sóc khách hàng nhiệt tình, sẵn sàng hỗ trợ 24/7. 
                Giải quyết mọi thắc mắc nhanh chóng và hiệu quả.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Đa dạng môn thể thao</h3>
              <p className="text-gray-600 leading-relaxed">
                Từ bóng đá, cầu lông, tennis đến bóng rổ, pickleball. 
                Đáp ứng mọi nhu cầu thể thao của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu chưa?
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Tham gia cùng hàng nghìn người chơi đã tin tưởng BookingSport
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/courts">
              <Button size="lg" variant="secondary" className="gap-2">
                Khám phá sân ngay <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
