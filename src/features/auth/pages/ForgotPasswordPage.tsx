import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { Button, Input, Card, CardBody } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { Mail, Home } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotMutation.mutate(data);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kiểm tra email của bạn</h1>
          <p className="text-gray-600 mb-6">
            Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button>Quay lại đăng nhập</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu?</h1>
          <p className="text-gray-600 mt-2">Nhập email để nhận liên kết đặt lại mật khẩu</p>
        </div>

        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={forgotMutation.isPending}
              >
                Gửi liên kết
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              <Link to={ROUTES.LOGIN} className="text-emerald-600 hover:text-emerald-700 font-medium">
                ← Quay lại đăng nhập
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
