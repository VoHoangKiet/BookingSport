import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userApi } from '@/api';
import { useAuthStore } from '@/stores/auth.store';
import { Button, Input, Card, CardBody, CardHeader } from '@/components/ui';

const profileSchema = z.object({
  ho_ten: z.string().min(1, 'Vui lòng nhập họ tên'),
  so_dien_thoai: z.string().optional(),
  dia_chi: z.string().optional(),
});

const passwordSchema = z.object({
  mat_khau_cu: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  mat_khau_moi: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  confirm_password: z.string(),
}).refine((data) => data.mat_khau_moi === data.confirm_password, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirm_password'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile,
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile ? {
      ho_ten: profile.ho_ten || '',
      so_dien_thoai: profile.so_dien_thoai || '',
      dia_chi: profile.dia_chi || '',
    } : undefined,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      setPasswordSuccess(true);
      setPasswordError('');
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: () => {
      setPasswordError('Mật khẩu cũ không đúng');
      setPasswordSuccess(false);
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    setPasswordError('');
    changePasswordMutation.mutate({
      mat_khau_cu: data.mat_khau_cu,
      mat_khau_moi: data.mat_khau_moi,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thông tin cá nhân</h1>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  {profile?.anh_dai_dien ? (
                    <img
                      src={profile.anh_dai_dien}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-emerald-600">
                      {profile?.ho_ten?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{profile?.ho_ten || 'Chưa cập nhật'}</h2>
                  <p className="text-gray-500">{profile?.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <Input
                  label="Họ tên"
                  error={profileErrors.ho_ten?.message}
                  {...registerProfile('ho_ten')}
                />
                <Input
                  label="Số điện thoại"
                  type="tel"
                  error={profileErrors.so_dien_thoai?.message}
                  {...registerProfile('so_dien_thoai')}
                />
                <Input
                  label="Địa chỉ"
                  error={profileErrors.dia_chi?.message}
                  {...registerProfile('dia_chi')}
                />
                <Button
                  type="submit"
                  isLoading={updateProfileMutation.isPending}
                >
                  Cập nhật thông tin
                </Button>
                {updateProfileMutation.isSuccess && (
                  <p className="text-green-600 text-sm">Cập nhật thành công!</p>
                )}
              </form>
            </CardBody>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-lg">Đổi mật khẩu</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    Đổi mật khẩu thành công!
                  </div>
                )}
                <Input
                  label="Mật khẩu hiện tại"
                  type="password"
                  error={passwordErrors.mat_khau_cu?.message}
                  {...registerPassword('mat_khau_cu')}
                />
                <Input
                  label="Mật khẩu mới"
                  type="password"
                  error={passwordErrors.mat_khau_moi?.message}
                  {...registerPassword('mat_khau_moi')}
                />
                <Input
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  error={passwordErrors.confirm_password?.message}
                  {...registerPassword('confirm_password')}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={changePasswordMutation.isPending}
                >
                  Đổi mật khẩu
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
