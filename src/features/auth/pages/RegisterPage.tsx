import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { Button, Input, Card, CardBody } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { Home, Building2, Mail, Phone, X } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  mat_khau: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirm_password: z.string(),
  ho_ten: z.string().optional(),
}).refine((data) => data.mat_khau === data.confirm_password, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirm_password'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      navigate(ROUTES.LOGIN, { 
        state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } 
      });
    },
    onError: () => {
      setError('Đăng ký thất bại. Email có thể đã được sử dụng.');
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setError('');
    registerMutation.mutate({
      email: data.email,
      mat_khau: data.mat_khau,
      ho_ten: data.ho_ten,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">BookingSport</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản</h1>
          <p className="text-gray-600 mt-2">Bắt đầu đặt sân thể thao ngay hôm nay</p>
        </div>

        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Họ tên"
                placeholder="Nguyễn Văn A"
                error={errors.ho_ten?.message}
                {...register('ho_ten')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                error={errors.mat_khau?.message}
                {...register('mat_khau')}
              />

              <Input
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="••••••••"
                error={errors.confirm_password?.message}
                {...register('confirm_password')}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={registerMutation.isPending}
              >
                Đăng ký
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to={ROUTES.LOGIN} className="text-emerald-600 hover:text-emerald-700 font-medium">
                Đăng nhập
              </Link>
            </p>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowOwnerModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors font-medium text-sm"
              >
                <Building2 className="w-4 h-4" />
                Đăng ký làm chủ sân
              </button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal đăng ký chủ sân */}
      {showOwnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowOwnerModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Đăng ký làm chủ sân</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Vui lòng liên hệ Admin qua thông tin bên dưới để được hỗ trợ đăng ký tài khoản chủ sân.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="mailto:ngcha763@gmail.com"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">ngcha763@gmail.com</div>
                </div>
              </a>

              <a
                href="tel:0788589842"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Số điện thoại</div>
                  <div className="font-medium text-gray-900">0788 589 842</div>
                </div>
              </a>
            </div>

            <button
              onClick={() => setShowOwnerModal(false)}
              className="w-full mt-6 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
