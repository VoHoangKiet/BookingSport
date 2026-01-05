import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { Button, Input, Card, CardBody } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { Home } from 'lucide-react';

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
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
